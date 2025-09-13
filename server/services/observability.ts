import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

export function initObservability() {
  // Only initialize if OTEL endpoints are configured
  const traceEndpoint = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
  const metricsEndpoint = process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT;
  
  if (!traceEndpoint && !metricsEndpoint) {
    console.log('📊 [observability] OTEL endpoints not configured, skipping observability setup');
    return;
  }

  try {
    const sdkConfig: any = {};

    // Configure trace exporter if endpoint is provided
    if (traceEndpoint) {
      sdkConfig.traceExporter = new OTLPTraceExporter({
        url: traceEndpoint,
        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? 
          JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) : {}
      });
      console.log('📈 [observability] Trace exporter configured:', traceEndpoint);
    }

    // Configure metrics exporter if endpoint is provided
    if (metricsEndpoint) {
      sdkConfig.metricReader = new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: metricsEndpoint,
          headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? 
            JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) : {}
        }),
        exportIntervalMillis: parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || '30000', 10)
      });
      console.log('📊 [observability] Metrics exporter configured:', metricsEndpoint);
    }

    const sdk = new NodeSDK(sdkConfig);
    
    sdk.start()
      .then(() => {
        console.log('✅ [observability] OpenTelemetry SDK started successfully');
      })
      .catch((error) => {
        console.warn('⚠️ [observability] Failed to start OpenTelemetry SDK:', error.message);
      });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      sdk.shutdown()
        .then(() => console.log('🔽 [observability] OpenTelemetry SDK terminated'))
        .catch((error) => console.error('❌ [observability] Error terminating SDK:', error))
        .finally(() => process.exit(0));
    });

    return sdk;
  } catch (error) {
    console.warn('⚠️ [observability] Failed to initialize observability:', error);
  }
}