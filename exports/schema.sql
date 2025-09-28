--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analysis_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.analysis_sessions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    prompt text NOT NULL,
    mode text NOT NULL,
    settings jsonb,
    results jsonb,
    telemetry jsonb,
    user_id character varying,
    workspace_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    debate_history jsonb,
    title text,
    source_session_id character varying,
    transfer_count integer DEFAULT 0,
    brainstorm_results jsonb,
    last_brainstormed_at timestamp without time zone,
    last_report_generated_at timestamp without time zone,
    last_report_type character varying
);


ALTER TABLE public.analysis_sessions OWNER TO neondb_owner;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    user_id character varying,
    action text NOT NULL,
    resource_type text,
    resource_id text,
    details jsonb,
    ip_address character varying,
    user_agent text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.chat_messages (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_code character varying NOT NULL,
    user_id character varying NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now(),
    message_type character varying DEFAULT 'chat'::character varying NOT NULL,
    CONSTRAINT chat_messages_message_type_check CHECK (((message_type)::text = ANY ((ARRAY['chat'::character varying, 'system'::character varying, 'debate_update'::character varying])::text[])))
);


ALTER TABLE public.chat_messages OWNER TO neondb_owner;

--
-- Name: debate_runs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.debate_runs (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying NOT NULL,
    mode character varying NOT NULL,
    status character varying DEFAULT 'running'::character varying NOT NULL,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    latency_ms integer,
    error_class text
);


ALTER TABLE public.debate_runs OWNER TO neondb_owner;

--
-- Name: dunning_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dunning_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    org_id text,
    event text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dunning_events OWNER TO neondb_owner;

--
-- Name: enhanced_usage_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.enhanced_usage_metrics (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    organization_id text NOT NULL,
    resource_type text NOT NULL,
    action text NOT NULL,
    metric_type text NOT NULL,
    value numeric NOT NULL,
    unit text,
    tags text[] DEFAULT '{}'::text[],
    dimensions jsonb DEFAULT '{}'::jsonb,
    recorded_at timestamp without time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    user_id text,
    resource_id text,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.enhanced_usage_metrics OWNER TO neondb_owner;

--
-- Name: entitlements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.entitlements (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    workspace_id character varying NOT NULL,
    feature character varying NOT NULL,
    source character varying DEFAULT 'subscription'::character varying NOT NULL,
    source_id character varying,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.entitlements OWNER TO neondb_owner;

--
-- Name: error_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.error_logs (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    error_type character varying NOT NULL,
    error_message text NOT NULL,
    error_stack text,
    endpoint character varying,
    user_id character varying,
    severity character varying DEFAULT 'medium'::character varying,
    resolved boolean DEFAULT false,
    resolved_at timestamp without time zone,
    resolved_by character varying,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.error_logs OWNER TO neondb_owner;

--
-- Name: export_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.export_logs (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying,
    workspace_id character varying,
    filename text,
    dlp_hits text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.export_logs OWNER TO neondb_owner;

--
-- Name: generated_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.generated_reports (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying NOT NULL,
    user_id character varying NOT NULL,
    report_type character varying NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    format character varying DEFAULT 'markdown'::character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    generated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.generated_reports OWNER TO neondb_owner;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id text,
    status text,
    amount_cents integer,
    currency text,
    due_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.invoices OWNER TO neondb_owner;

--
-- Name: legal_holds; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.legal_holds (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    hold_type character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    custodians jsonb DEFAULT '[]'::jsonb,
    data_types jsonb DEFAULT '[]'::jsonb,
    date_range_start timestamp without time zone,
    date_range_end timestamp without time zone,
    legal_matter_id character varying,
    court_order character varying,
    preserving_party character varying,
    legal_counsel character varying,
    created_by character varying NOT NULL,
    released_by character varying,
    released_at timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.legal_holds OWNER TO neondb_owner;

--
-- Name: onboarding_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.onboarding_progress (
    org_id text NOT NULL,
    steps jsonb DEFAULT '{}'::jsonb,
    completed boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.onboarding_progress OWNER TO neondb_owner;

--
-- Name: organization_analytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.organization_analytics (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    organization_id text NOT NULL,
    date date NOT NULL,
    active_users integer DEFAULT 0,
    total_sessions integer DEFAULT 0,
    templates_used integer DEFAULT 0,
    workflows_executed integer DEFAULT 0,
    api_calls integer DEFAULT 0,
    storage_used bigint DEFAULT 0,
    average_session_duration integer DEFAULT 0,
    top_templates jsonb DEFAULT '[]'::jsonb,
    top_users jsonb DEFAULT '[]'::jsonb,
    error_rate text DEFAULT '0'::text,
    performance jsonb DEFAULT '{}'::jsonb,
    features jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.organization_analytics OWNER TO neondb_owner;

--
-- Name: organization_daily_reports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.organization_daily_reports (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    organization_id text NOT NULL,
    report_date date NOT NULL,
    report_type text DEFAULT 'daily_summary'::text,
    title text NOT NULL,
    summary text,
    key_metrics jsonb DEFAULT '{}'::jsonb,
    insights jsonb DEFAULT '[]'::jsonb,
    recommendations jsonb DEFAULT '[]'::jsonb,
    alerts jsonb DEFAULT '[]'::jsonb,
    charts jsonb DEFAULT '{}'::jsonb,
    generated_by text DEFAULT 'system'::text,
    generated_at timestamp without time zone DEFAULT now(),
    recipients jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.organization_daily_reports OWNER TO neondb_owner;

--
-- Name: organization_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.organization_members (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    user_id character varying NOT NULL,
    role character varying DEFAULT 'member'::character varying NOT NULL,
    permissions jsonb DEFAULT '{"manage_users": false, "manage_billing": false, "manage_security": false, "view_audit_logs": false, "manage_workspaces": false}'::jsonb,
    joined_at timestamp without time zone DEFAULT now(),
    last_active_at timestamp without time zone
);


ALTER TABLE public.organization_members OWNER TO neondb_owner;

--
-- Name: organizations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.organizations (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug character varying NOT NULL,
    logo_url character varying,
    plan character varying DEFAULT 'free'::character varying NOT NULL,
    settings jsonb DEFAULT '{"max_users": 50, "require_2fa": false, "max_workspaces": 10, "retention_days": 90, "allowed_domains": [], "default_security_level": "standard"}'::jsonb,
    billing_settings jsonb DEFAULT '{"quota_limits": {"storage_gb": 5, "monthly_analyses": 1000, "concurrent_sessions": 10}, "usage_alerts": true, "billing_email": null}'::jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    trial_start timestamp without time zone,
    trial_end timestamp without time zone
);


ALTER TABLE public.organizations OWNER TO neondb_owner;

--
-- Name: performance_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.performance_metrics (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    metric_name character varying NOT NULL,
    metric_value numeric NOT NULL,
    metric_unit character varying DEFAULT 'ms'::character varying,
    endpoint character varying,
    status_code integer,
    user_id character varying,
    recorded_at timestamp without time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.performance_metrics OWNER TO neondb_owner;

--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    user_id text,
    endpoint text NOT NULL,
    keys_json jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.push_subscriptions OWNER TO neondb_owner;

--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.push_subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- Name: rate_limit_rules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rate_limit_rules (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    rule_name character varying NOT NULL,
    resource_type character varying NOT NULL,
    limit_type character varying DEFAULT 'requests_per_minute'::character varying,
    limit_value integer NOT NULL,
    window_ms integer DEFAULT 60000,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.rate_limit_rules OWNER TO neondb_owner;

--
-- Name: retention_policies; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.retention_policies (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    data_type character varying NOT NULL,
    retention_period_days integer NOT NULL,
    grace_period_days integer DEFAULT 30 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    conditions jsonb DEFAULT '{}'::jsonb,
    actions jsonb DEFAULT '{}'::jsonb,
    exemptions jsonb DEFAULT '[]'::jsonb,
    last_run_at timestamp without time zone,
    next_run_at timestamp without time zone,
    created_by character varying NOT NULL,
    approved_by character varying,
    approved_at timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.retention_policies OWNER TO neondb_owner;

--
-- Name: review_steps; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.review_steps (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    review_id character varying NOT NULL,
    step_number integer NOT NULL,
    step_type character varying NOT NULL,
    title text NOT NULL,
    description text,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    is_required boolean DEFAULT true,
    can_skip boolean DEFAULT false,
    completed_at timestamp without time zone,
    completed_by character varying,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.review_steps OWNER TO neondb_owner;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reviews (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    workspace_id character varying,
    initiator_id character varying NOT NULL,
    resource_type character varying NOT NULL,
    resource_id character varying NOT NULL,
    review_type character varying NOT NULL,
    title text NOT NULL,
    description text,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    priority character varying DEFAULT 'medium'::character varying NOT NULL,
    due_date timestamp without time zone,
    approved_at timestamp without time zone,
    rejected_at timestamp without time zone,
    completed_at timestamp without time zone,
    completed_by character varying,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO neondb_owner;

--
-- Name: scim_groups; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.scim_groups (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    external_id character varying NOT NULL,
    scim_id character varying NOT NULL,
    display_name character varying NOT NULL,
    description text,
    group_type character varying DEFAULT 'role'::character varying,
    mapped_role character varying,
    mapped_team_id character varying,
    permissions jsonb DEFAULT '[]'::jsonb,
    custom_attributes jsonb DEFAULT '{}'::jsonb,
    last_sync_at timestamp without time zone,
    sync_status character varying DEFAULT 'active'::character varying NOT NULL,
    sync_error text,
    member_count integer DEFAULT 0 NOT NULL,
    provisioned_at timestamp without time zone DEFAULT now(),
    deprovisioned_at timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.scim_groups OWNER TO neondb_owner;

--
-- Name: scim_users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.scim_users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    external_id character varying NOT NULL,
    scim_id character varying NOT NULL,
    user_name character varying NOT NULL,
    email character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    display_name character varying,
    active boolean DEFAULT true NOT NULL,
    local_user_id character varying,
    department character varying,
    title character varying,
    manager character varying,
    employee_number character varying,
    cost_center character varying,
    division character varying,
    custom_attributes jsonb DEFAULT '{}'::jsonb,
    last_sync_at timestamp without time zone,
    sync_status character varying DEFAULT 'active'::character varying NOT NULL,
    sync_error text,
    provisioned_at timestamp without time zone DEFAULT now(),
    deprovisioned_at timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.scim_users OWNER TO neondb_owner;

--
-- Name: seats; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.seats (
    org_id text NOT NULL,
    seats integer,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.seats OWNER TO neondb_owner;

--
-- Name: security_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.security_events (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    event_type text NOT NULL,
    severity text NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    resolved boolean DEFAULT false,
    resolved_at timestamp without time zone,
    resolved_by character varying,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.security_events OWNER TO neondb_owner;

--
-- Name: session_codes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session_codes (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    code character varying(8) NOT NULL,
    created_by character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.session_codes OWNER TO neondb_owner;

--
-- Name: session_participants; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session_participants (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    session_code character varying NOT NULL,
    user_id character varying NOT NULL,
    joined_at timestamp without time zone DEFAULT now(),
    role character varying DEFAULT 'participant'::character varying NOT NULL,
    CONSTRAINT session_participants_role_check CHECK (((role)::text = ANY ((ARRAY['viewer'::character varying, 'participant'::character varying, 'moderator'::character varying])::text[])))
);


ALTER TABLE public.session_participants OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscriptions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    workspace_id character varying NOT NULL,
    plan character varying DEFAULT 'free'::character varying NOT NULL,
    status character varying DEFAULT 'active'::character varying NOT NULL,
    seats integer DEFAULT 1,
    billing_period character varying DEFAULT 'monthly'::character varying,
    price_cents integer,
    currency character varying DEFAULT 'USD'::character varying,
    stripe_subscription_id character varying,
    stripe_customer_id character varying,
    current_period_start timestamp without time zone,
    current_period_end timestamp without time zone,
    trial_end timestamp without time zone,
    cancelled_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    cancel_at_period_end boolean DEFAULT false
);


ALTER TABLE public.subscriptions OWNER TO neondb_owner;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teams (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying NOT NULL,
    name text NOT NULL,
    description text,
    parent_team_id character varying,
    settings jsonb DEFAULT '{"auto_join_workspaces": false, "default_workspace_privacy": "private"}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.teams OWNER TO neondb_owner;

--
-- Name: template_audit; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.template_audit (
    id integer NOT NULL,
    template_id uuid,
    action text,
    actor text,
    at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.template_audit OWNER TO neondb_owner;

--
-- Name: template_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.template_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.template_audit_id_seq OWNER TO neondb_owner;

--
-- Name: template_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.template_audit_id_seq OWNED BY public.template_audit.id;


--
-- Name: template_products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.template_products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    price_cents integer NOT NULL,
    currency character varying DEFAULT 'USD'::character varying NOT NULL,
    template_id uuid NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.template_products OWNER TO neondb_owner;

--
-- Name: template_purchases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.template_purchases (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    workspace_id character varying NOT NULL,
    user_id character varying NOT NULL,
    template_product_id character varying NOT NULL,
    price_cents integer NOT NULL,
    currency character varying NOT NULL,
    license_key character varying NOT NULL,
    purchased_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.template_purchases OWNER TO neondb_owner;

--
-- Name: templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.templates (
    id uuid NOT NULL,
    version integer NOT NULL,
    title text NOT NULL,
    tags text[],
    content_json jsonb,
    published boolean DEFAULT false,
    created_by text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.templates OWNER TO neondb_owner;

--
-- Name: tutorial_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tutorial_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tutorial_id uuid NOT NULL,
    status character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    current_step integer DEFAULT 1,
    completed_steps integer[] DEFAULT '{}'::integer[],
    skipped_steps integer[] DEFAULT '{}'::integer[],
    time_spent_minutes integer DEFAULT 0,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tutorial_progress OWNER TO neondb_owner;

--
-- Name: tutorial_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tutorial_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    auto_start_tutorials boolean DEFAULT true,
    show_tooltips boolean DEFAULT true,
    tutorial_speed character varying(20) DEFAULT 'normal'::character varying,
    preferred_position character varying(20) DEFAULT 'bottom'::character varying,
    disabled_categories text[] DEFAULT '{}'::text[],
    notification_preferences jsonb DEFAULT '{"new_tutorials": true, "completion_rewards": true, "progress_reminders": true}'::jsonb,
    experience_level character varying(20) DEFAULT 'beginner'::character varying,
    completed_tutorial_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_dismissed_tutorial character varying
);


ALTER TABLE public.tutorial_settings OWNER TO neondb_owner;

--
-- Name: tutorial_steps; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tutorial_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tutorial_id uuid NOT NULL,
    step_number integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    target_element character varying(255),
    target_page character varying(255),
    "position" character varying(20) DEFAULT 'bottom'::character varying,
    step_type character varying(20) DEFAULT 'tooltip'::character varying,
    interaction_type character varying(20) DEFAULT 'none'::character varying,
    next_condition character varying(255),
    skip_allowed boolean DEFAULT true,
    auto_advance boolean DEFAULT false,
    delay_ms integer DEFAULT 0,
    styling jsonb,
    validation jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.tutorial_steps OWNER TO neondb_owner;

--
-- Name: tutorials; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.tutorials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(100) NOT NULL,
    target_feature character varying(100),
    target_user_level character varying(50) NOT NULL,
    estimated_duration integer,
    priority integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    trigger_conditions jsonb DEFAULT '[]'::jsonb,
    completion_rewards jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.tutorials OWNER TO neondb_owner;

--
-- Name: usage_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.usage_metrics (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    organization_id character varying,
    user_id character varying,
    metric_type character varying NOT NULL,
    metric_name character varying NOT NULL,
    value_numeric integer DEFAULT 0,
    value_text character varying,
    period character varying DEFAULT 'daily'::character varying,
    recorded_at timestamp without time zone DEFAULT now(),
    value integer,
    unit character varying,
    period_start timestamp without time zone,
    period_end timestamp without time zone
);


ALTER TABLE public.usage_metrics OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    preferences jsonb DEFAULT '{"theme": "light", "language": "en", "auto_save": true, "default_model": "gpt-5", "notifications": true, "default_temperature": 0.7}'::jsonb,
    subscription jsonb DEFAULT '{"plan": "free", "reset_date": null, "usage_count": 0, "monthly_limit": 10}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    onboarding_progress jsonb DEFAULT '{"current_flow": null, "feature_usage": {}, "skipped_flows": [], "completed_steps": [], "experience_level": "beginner", "last_interaction": null}'::jsonb,
    stripe_customer_id character varying
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.users IS 'User accounts for SymbiosoAi ThinkTank';


--
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.webhook_deliveries (
    id integer NOT NULL,
    endpoint_id integer,
    event_id text NOT NULL,
    status text,
    attempts integer DEFAULT 0,
    response_code integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.webhook_deliveries OWNER TO neondb_owner;

--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.webhook_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.webhook_deliveries_id_seq OWNER TO neondb_owner;

--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.webhook_deliveries_id_seq OWNED BY public.webhook_deliveries.id;


--
-- Name: webhook_endpoints; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.webhook_endpoints (
    id integer NOT NULL,
    org_id text,
    url text NOT NULL,
    secret text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.webhook_endpoints OWNER TO neondb_owner;

--
-- Name: webhook_endpoints_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.webhook_endpoints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.webhook_endpoints_id_seq OWNER TO neondb_owner;

--
-- Name: webhook_endpoints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.webhook_endpoints_id_seq OWNED BY public.webhook_endpoints.id;


--
-- Name: workflow_definitions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workflow_definitions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    organization_id text NOT NULL,
    name text NOT NULL,
    description text,
    triggers jsonb DEFAULT '[]'::jsonb,
    actions jsonb DEFAULT '[]'::jsonb,
    conditions jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_by text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.workflow_definitions OWNER TO neondb_owner;

--
-- Name: workflow_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workflow_events (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    organization_id text NOT NULL,
    event_type text NOT NULL,
    event_data jsonb,
    source text,
    priority integer DEFAULT 1,
    status text DEFAULT 'pending'::text,
    processed_at timestamp without time zone,
    retry_count integer DEFAULT 0,
    error_message text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    workflow_execution_id text,
    scheduled_for timestamp without time zone
);


ALTER TABLE public.workflow_events OWNER TO neondb_owner;

--
-- Name: workflow_executions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workflow_executions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    workflow_definition_id text NOT NULL,
    organization_id text NOT NULL,
    triggered_by text,
    trigger_data jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text,
    current_step integer DEFAULT 0,
    total_steps integer DEFAULT 0,
    results jsonb DEFAULT '[]'::jsonb,
    error_message text,
    started_at timestamp without time zone DEFAULT now(),
    completed_at timestamp without time zone,
    duration bigint,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.workflow_executions OWNER TO neondb_owner;

--
-- Name: workspace_invites; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workspace_invites (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    workspace_id character varying NOT NULL,
    invited_by_user_id character varying NOT NULL,
    email text,
    invite_code character varying(16),
    role text DEFAULT 'member'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.workspace_invites OWNER TO neondb_owner;

--
-- Name: workspace_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workspace_members (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    workspace_id character varying NOT NULL,
    user_id character varying NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    joined_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.workspace_members OWNER TO neondb_owner;

--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workspaces (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    session_code character varying(8) NOT NULL,
    is_private boolean DEFAULT false,
    owner_id character varying NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.workspaces OWNER TO neondb_owner;

--
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- Name: template_audit id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.template_audit ALTER COLUMN id SET DEFAULT nextval('public.template_audit_id_seq'::regclass);


--
-- Name: webhook_deliveries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_deliveries ALTER COLUMN id SET DEFAULT nextval('public.webhook_deliveries_id_seq'::regclass);


--
-- Name: webhook_endpoints id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_endpoints ALTER COLUMN id SET DEFAULT nextval('public.webhook_endpoints_id_seq'::regclass);


--
-- Name: analysis_sessions analysis_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.analysis_sessions
    ADD CONSTRAINT analysis_sessions_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: debate_runs debate_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.debate_runs
    ADD CONSTRAINT debate_runs_pkey PRIMARY KEY (id);


--
-- Name: dunning_events dunning_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dunning_events
    ADD CONSTRAINT dunning_events_pkey PRIMARY KEY (id);


--
-- Name: enhanced_usage_metrics enhanced_usage_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enhanced_usage_metrics
    ADD CONSTRAINT enhanced_usage_metrics_pkey PRIMARY KEY (id);


--
-- Name: entitlements entitlements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.entitlements
    ADD CONSTRAINT entitlements_pkey PRIMARY KEY (id);


--
-- Name: error_logs error_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.error_logs
    ADD CONSTRAINT error_logs_pkey PRIMARY KEY (id);


--
-- Name: export_logs export_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.export_logs
    ADD CONSTRAINT export_logs_pkey PRIMARY KEY (id);


--
-- Name: generated_reports generated_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.generated_reports
    ADD CONSTRAINT generated_reports_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: legal_holds legal_holds_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.legal_holds
    ADD CONSTRAINT legal_holds_pkey PRIMARY KEY (id);


--
-- Name: onboarding_progress onboarding_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.onboarding_progress
    ADD CONSTRAINT onboarding_progress_pkey PRIMARY KEY (org_id);


--
-- Name: organization_analytics organization_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organization_analytics
    ADD CONSTRAINT organization_analytics_pkey PRIMARY KEY (id);


--
-- Name: organization_daily_reports organization_daily_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organization_daily_reports
    ADD CONSTRAINT organization_daily_reports_pkey PRIMARY KEY (id);


--
-- Name: organization_members organization_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organization_members
    ADD CONSTRAINT organization_members_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_slug_key UNIQUE (slug);


--
-- Name: performance_metrics performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: rate_limit_rules rate_limit_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rate_limit_rules
    ADD CONSTRAINT rate_limit_rules_pkey PRIMARY KEY (id);


--
-- Name: retention_policies retention_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.retention_policies
    ADD CONSTRAINT retention_policies_pkey PRIMARY KEY (id);


--
-- Name: review_steps review_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.review_steps
    ADD CONSTRAINT review_steps_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: scim_groups scim_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.scim_groups
    ADD CONSTRAINT scim_groups_pkey PRIMARY KEY (id);


--
-- Name: scim_groups scim_groups_scim_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.scim_groups
    ADD CONSTRAINT scim_groups_scim_id_key UNIQUE (scim_id);


--
-- Name: scim_users scim_users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.scim_users
    ADD CONSTRAINT scim_users_pkey PRIMARY KEY (id);


--
-- Name: scim_users scim_users_scim_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.scim_users
    ADD CONSTRAINT scim_users_scim_id_key UNIQUE (scim_id);


--
-- Name: seats seats_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.seats
    ADD CONSTRAINT seats_pkey PRIMARY KEY (org_id);


--
-- Name: security_events security_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.security_events
    ADD CONSTRAINT security_events_pkey PRIMARY KEY (id);


--
-- Name: session_codes session_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session_codes
    ADD CONSTRAINT session_codes_code_key UNIQUE (code);


--
-- Name: session_codes session_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session_codes
    ADD CONSTRAINT session_codes_pkey PRIMARY KEY (id);


--
-- Name: session_participants session_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session_participants
    ADD CONSTRAINT session_participants_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: template_audit template_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.template_audit
    ADD CONSTRAINT template_audit_pkey PRIMARY KEY (id);


--
-- Name: template_products template_products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.template_products
    ADD CONSTRAINT template_products_pkey PRIMARY KEY (id);


--
-- Name: template_purchases template_purchases_license_key_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.template_purchases
    ADD CONSTRAINT template_purchases_license_key_key UNIQUE (license_key);


--
-- Name: template_purchases template_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.template_purchases
    ADD CONSTRAINT template_purchases_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: tutorial_progress tutorial_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_progress
    ADD CONSTRAINT tutorial_progress_pkey PRIMARY KEY (id);


--
-- Name: tutorial_progress tutorial_progress_user_id_tutorial_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_progress
    ADD CONSTRAINT tutorial_progress_user_id_tutorial_id_key UNIQUE (user_id, tutorial_id);


--
-- Name: tutorial_settings tutorial_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_settings
    ADD CONSTRAINT tutorial_settings_pkey PRIMARY KEY (id);


--
-- Name: tutorial_settings tutorial_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_settings
    ADD CONSTRAINT tutorial_settings_user_id_key UNIQUE (user_id);


--
-- Name: tutorial_steps tutorial_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_steps
    ADD CONSTRAINT tutorial_steps_pkey PRIMARY KEY (id);


--
-- Name: tutorial_steps tutorial_steps_tutorial_id_step_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_steps
    ADD CONSTRAINT tutorial_steps_tutorial_id_step_number_key UNIQUE (tutorial_id, step_number);


--
-- Name: tutorials tutorials_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorials
    ADD CONSTRAINT tutorials_pkey PRIMARY KEY (id);


--
-- Name: usage_metrics usage_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.usage_metrics
    ADD CONSTRAINT usage_metrics_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webhook_deliveries webhook_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (id);


--
-- Name: webhook_endpoints webhook_endpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.webhook_endpoints
    ADD CONSTRAINT webhook_endpoints_pkey PRIMARY KEY (id);


--
-- Name: workflow_definitions workflow_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workflow_definitions
    ADD CONSTRAINT workflow_definitions_pkey PRIMARY KEY (id);


--
-- Name: workflow_events workflow_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workflow_events
    ADD CONSTRAINT workflow_events_pkey PRIMARY KEY (id);


--
-- Name: workflow_executions workflow_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT workflow_executions_pkey PRIMARY KEY (id);


--
-- Name: workspace_invites workspace_invites_invite_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspace_invites
    ADD CONSTRAINT workspace_invites_invite_code_unique UNIQUE (invite_code);


--
-- Name: workspace_invites workspace_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspace_invites
    ADD CONSTRAINT workspace_invites_pkey PRIMARY KEY (id);


--
-- Name: workspace_members workspace_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_session_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_session_code_unique UNIQUE (session_code);


--
-- Name: entitlements_expires_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX entitlements_expires_idx ON public.entitlements USING btree (expires_at);


--
-- Name: entitlements_feature_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX entitlements_feature_idx ON public.entitlements USING btree (feature);


--
-- Name: entitlements_source_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX entitlements_source_idx ON public.entitlements USING btree (source);


--
-- Name: entitlements_workspace_feature_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX entitlements_workspace_feature_unique ON public.entitlements USING btree (workspace_id, feature, source_id);


--
-- Name: entitlements_workspace_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX entitlements_workspace_idx ON public.entitlements USING btree (workspace_id);


--
-- Name: idx_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_expire ON public.sessions USING btree (expire);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: subscriptions_plan_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX subscriptions_plan_idx ON public.subscriptions USING btree (plan);


--
-- Name: subscriptions_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX subscriptions_status_idx ON public.subscriptions USING btree (status);


--
-- Name: subscriptions_workspace_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX subscriptions_workspace_idx ON public.subscriptions USING btree (workspace_id);


--
-- Name: subscriptions_workspace_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX subscriptions_workspace_unique ON public.subscriptions USING btree (workspace_id);


--
-- Name: template_products_active_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_products_active_idx ON public.template_products USING btree (is_active);


--
-- Name: template_products_price_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_products_price_idx ON public.template_products USING btree (price_cents);


--
-- Name: template_products_template_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_products_template_idx ON public.template_products USING btree (template_id);


--
-- Name: template_products_template_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX template_products_template_unique ON public.template_products USING btree (template_id);


--
-- Name: template_purchases_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_purchases_date_idx ON public.template_purchases USING btree (purchased_at);


--
-- Name: template_purchases_license_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_purchases_license_idx ON public.template_purchases USING btree (license_key);


--
-- Name: template_purchases_product_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_purchases_product_idx ON public.template_purchases USING btree (template_product_id);


--
-- Name: template_purchases_user_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_purchases_user_idx ON public.template_purchases USING btree (user_id);


--
-- Name: template_purchases_workspace_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX template_purchases_workspace_idx ON public.template_purchases USING btree (workspace_id);


--
-- Name: template_purchases_workspace_product_unique; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX template_purchases_workspace_product_unique ON public.template_purchases USING btree (workspace_id, template_product_id);


--
-- Name: uniq_endpoint_event; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX uniq_endpoint_event ON public.webhook_deliveries USING btree (endpoint_id, event_id);


--
-- Name: tutorial_progress tutorial_progress_tutorial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_progress
    ADD CONSTRAINT tutorial_progress_tutorial_id_fkey FOREIGN KEY (tutorial_id) REFERENCES public.tutorials(id) ON DELETE CASCADE;


--
-- Name: tutorial_steps tutorial_steps_tutorial_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.tutorial_steps
    ADD CONSTRAINT tutorial_steps_tutorial_id_fkey FOREIGN KEY (tutorial_id) REFERENCES public.tutorials(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

