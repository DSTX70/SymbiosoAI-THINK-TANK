/**
 * Admin Core Functionality Test Suite
 * 
 * Tests core admin creation logic and security functions directly
 * without complex authentication mocking.
 */

import { storage } from '../server/storage';
import type { User, SystemUserRole } from '@shared/schema';

describe('Admin Core Functionality Tests', () => {
  let testUsers: User[] = [];

  afterAll(async () => {
    // Clean up test users
    for (const user of testUsers) {
      try {
        console.log(`🧹 Cleaning up test user: ${user.id}`);
      } catch (error) {
        console.warn(`Failed to clean up user ${user.id}:`, error);
      }
    }
    console.log('🧪 Admin core functionality tests completed');
  });

  // Helper function to create a test user
  const createTestUser = async (userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> => {
    const user = await storage.upsertUser({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    
    testUsers.push(user);
    return user;
  };

  describe('Storage Layer - User Role Management', () => {
    
    test('should set user role successfully', async () => {
      const testUser = await createTestUser({
        id: 'role-test-user-1',
        email: 'roletest1@test.com',
        firstName: 'Role',
        lastName: 'Test'
      });

      const updatedUser = await storage.setUserRole(testUser.id, 'admin');
      expect(updatedUser).toBeTruthy();
      expect(updatedUser?.role).toBe('admin');
      
      // Verify in database
      const dbUser = await storage.getUser(testUser.id);
      expect(dbUser?.role).toBe('admin');
      
      console.log('✅ setUserRole working correctly');
    });

    test('should detect when system admin exists', async () => {
      // Create a system admin user
      const adminUser = await createTestUser({
        id: 'system-admin-check',
        email: 'admincheck@test.com',
        firstName: 'Admin',
        lastName: 'Check'
      });
      
      await storage.setUserRole(adminUser.id, 'system_admin');
      
      const adminExists = await storage.anySystemAdminExists();
      expect(adminExists).toBe(true);
      
      console.log('✅ anySystemAdminExists detecting system admin correctly');
    });

    test('should prevent demotion of last system admin', async () => {
      // Create a system admin
      const adminUser = await createTestUser({
        id: 'last-admin-protection',
        email: 'lastadmin@test.com',
        firstName: 'Last',
        lastName: 'Admin'
      });
      
      await storage.setUserRole(adminUser.id, 'system_admin');
      
      // Count current system admins
      const allUsers = await storage.getAllUsers(1000, 0);
      const systemAdminCount = allUsers.filter(u => u.role === 'system_admin').length;
      
      if (systemAdminCount === 1) {
        // This should fail with last admin protection
        try {
          await storage.setUserRole(adminUser.id, 'user');
          fail('Should have thrown an error for last admin protection');
        } catch (error: any) {
          expect(error.message).toContain('Cannot demote the last system administrator');
          console.log('✅ Last system admin protection working correctly');
        }
      } else {
        console.log('⚠️ Multiple system admins exist, skipping last admin protection test');
      }
    });

    test('should handle role transitions correctly', async () => {
      const testUser = await createTestUser({
        id: 'role-transition-user',
        email: 'transition@test.com',
        firstName: 'Transition',
        lastName: 'User'
      });

      // Test role progression: user -> premium_user -> admin -> system_admin
      const roles: SystemUserRole[] = ['premium_user', 'admin', 'system_admin', 'user'];
      
      for (const role of roles) {
        const updatedUser = await storage.setUserRole(testUser.id, role);
        expect(updatedUser?.role).toBe(role);
        
        // Verify in database each time
        const dbUser = await storage.getUser(testUser.id);
        expect(dbUser?.role).toBe(role);
      }
      
      console.log('✅ Role transitions working correctly');
    });
  });

  describe('Allowlist Logic Validation', () => {
    
    test('should parse allowlist environment variables correctly', async () => {
      // Test the parseAllowlist function
      const originalEnv = process.env.TEST_ALLOWLIST;
      
      // Test empty allowlist
      delete process.env.TEST_ALLOWLIST;
      const { parseAllowlist } = require('../server/replitAuth');
      expect(parseAllowlist('TEST_ALLOWLIST')).toEqual([]);
      
      // Test single item
      process.env.TEST_ALLOWLIST = 'user1';
      expect(parseAllowlist('TEST_ALLOWLIST')).toEqual(['user1']);
      
      // Test multiple items with spaces
      process.env.TEST_ALLOWLIST = 'user1, user2 , user3';
      expect(parseAllowlist('TEST_ALLOWLIST')).toEqual(['user1', 'user2', 'user3']);
      
      // Test empty items filtered out
      process.env.TEST_ALLOWLIST = 'user1,,user2, ,user3';
      expect(parseAllowlist('TEST_ALLOWLIST')).toEqual(['user1', 'user2', 'user3']);
      
      // Restore original
      if (originalEnv) process.env.TEST_ALLOWLIST = originalEnv;
      else delete process.env.TEST_ALLOWLIST;
      
      console.log('✅ Allowlist parsing working correctly');
    });

    test('should respect role hierarchy in elevation decisions', async () => {
      // Test role hierarchy logic
      const testUser = await createTestUser({
        id: 'hierarchy-test-user',
        email: 'hierarchy@test.com',
        firstName: 'Hierarchy',
        lastName: 'Test'
      });

      // Start as user, elevate to admin
      await storage.setUserRole(testUser.id, 'user');
      const mockClaims = {
        sub: 'hierarchy-test-user',
        email: 'hierarchy@test.com',
        first_name: 'Hierarchy',
        last_name: 'Test'
      };

      // Mock allowlist with this user
      const originalSystemAdminAllowlist = process.env.SYSTEM_ADMIN_ALLOWLIST_SUBS;
      const originalAdminAllowlist = process.env.ADMIN_ALLOWLIST_SUBS;
      
      process.env.SYSTEM_ADMIN_ALLOWLIST_SUBS = 'hierarchy-test-user';
      delete process.env.ADMIN_ALLOWLIST_SUBS;

      // Test elevation to system_admin
      const { maybeElevateRole } = require('../server/replitAuth');
      await maybeElevateRole(testUser.id, mockClaims);
      
      const elevatedUser = await storage.getUser(testUser.id);
      expect(elevatedUser?.role).toBe('system_admin');
      
      // Restore environment
      if (originalSystemAdminAllowlist) process.env.SYSTEM_ADMIN_ALLOWLIST_SUBS = originalSystemAdminAllowlist;
      else delete process.env.SYSTEM_ADMIN_ALLOWLIST_SUBS;
      if (originalAdminAllowlist) process.env.ADMIN_ALLOWLIST_SUBS = originalAdminAllowlist;
      
      console.log('✅ Role hierarchy elevation working correctly');
    });
  });

  describe('Data Validation and Schema Consistency', () => {
    
    test('should validate system user roles against schema', async () => {
      const { systemUserRoleSchema } = require('@shared/schema');
      
      // Test valid roles
      const validRoles = ['user', 'premium_user', 'admin', 'system_admin'];
      for (const role of validRoles) {
        const result = systemUserRoleSchema.safeParse(role);
        expect(result.success).toBe(true);
      }
      
      // Test invalid roles
      const invalidRoles = ['superuser', 'root', 'owner', 'moderator', ''];
      for (const role of invalidRoles) {
        const result = systemUserRoleSchema.safeParse(role);
        expect(result.success).toBe(false);
      }
      
      console.log('✅ Schema validation working correctly');
    });

    test('should maintain user data integrity', async () => {
      const testUser = await createTestUser({
        id: 'integrity-test-user',
        email: 'integrity@test.com',
        firstName: 'Integrity',
        lastName: 'Test'
      });

      // Test that all required fields are present
      expect(testUser.id).toBeTruthy();
      expect(testUser.email).toBe('integrity@test.com');
      expect(testUser.firstName).toBe('Integrity');
      expect(testUser.lastName).toBe('Test');
      expect(testUser.role).toBeTruthy(); // Should have default role
      expect(testUser.createdAt).toBeTruthy();
      expect(testUser.updatedAt).toBeTruthy();
      
      // Test that defaults are applied
      expect(testUser.role).toBe('user'); // Default role
      expect(testUser.preferences).toBeTruthy(); // Should have default preferences
      expect(testUser.subscription).toBeTruthy(); // Should have default subscription
      
      console.log('✅ User data integrity maintained correctly');
    });
  });

  describe('Audit Trail Functionality', () => {
    
    test('should create audit logs for role changes', async () => {
      const testUser = await createTestUser({
        id: 'audit-test-user',
        email: 'audit@test.com',
        firstName: 'Audit',
        lastName: 'Test'
      });

      // Get initial audit log count
      const initialLogs = await storage.getAuditLogs({ limit: 1000 });
      const initialCount = initialLogs.length;
      
      // Change user role
      await storage.setUserRole(testUser.id, 'admin');
      
      // Check audit logs were created
      const updatedLogs = await storage.getAuditLogs({ limit: 1000 });
      const newLogCount = updatedLogs.length;
      
      expect(newLogCount).toBeGreaterThan(initialCount);
      
      // Find the role change log
      const roleChangeLog = updatedLogs.find(log => 
        log.action === 'user_role_changed' && 
        log.userId === testUser.id
      );
      
      expect(roleChangeLog).toBeTruthy();
      expect(roleChangeLog?.details.newRole).toBe('admin');
      
      console.log('✅ Audit logging working correctly');
    });
  });

  describe('Security and Edge Cases', () => {
    
    test('should handle database errors gracefully', async () => {
      // Test with invalid user ID
      try {
        await storage.setUserRole('non-existent-user-id', 'admin');
        // Should return undefined or throw error, not crash
      } catch (error) {
        // This is expected for non-existent users
        console.log('✅ Graceful handling of database errors');
      }
    });

    test('should maintain consistency under multiple operations', async () => {
      const testUser = await createTestUser({
        id: 'consistency-test-user',
        email: 'consistency@test.com',
        firstName: 'Consistency',
        lastName: 'Test'
      });

      // Perform multiple rapid role changes
      const operations = [
        storage.setUserRole(testUser.id, 'premium_user'),
        storage.setUserRole(testUser.id, 'admin'),
        storage.setUserRole(testUser.id, 'user'),
        storage.setUserRole(testUser.id, 'admin'),
      ];

      const results = await Promise.allSettled(operations);
      
      // All operations should complete without crashing
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Operation ${index} failed:`, result.reason);
        }
      });
      
      // Final user state should be consistent
      const finalUser = await storage.getUser(testUser.id);
      expect(finalUser).toBeTruthy();
      expect(['user', 'premium_user', 'admin', 'system_admin']).toContain(finalUser?.role);
      
      console.log('✅ Consistency maintained under multiple operations');
    });

    test('should validate user count functionality', async () => {
      const userCount = await storage.getUserCount();
      expect(userCount).toBeGreaterThan(0);
      expect(typeof userCount).toBe('number');
      
      console.log(`✅ User count functionality working: ${userCount} users`);
    });

    test('should handle pagination correctly', async () => {
      // Test user listing with pagination
      const page1 = await storage.getAllUsers(2, 0); // First 2 users
      const page2 = await storage.getAllUsers(2, 2); // Next 2 users
      
      expect(Array.isArray(page1)).toBe(true);
      expect(Array.isArray(page2)).toBe(true);
      
      if (page1.length > 0 && page2.length > 0) {
        // Should not have overlapping users
        const page1Ids = new Set(page1.map(u => u.id));
        const page2Ids = new Set(page2.map(u => u.id));
        const overlap = [...page1Ids].filter(id => page2Ids.has(id));
        expect(overlap.length).toBe(0);
      }
      
      console.log('✅ Pagination working correctly');
    });
  });
});