'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Shield, TrendingDown, Zap, CheckCircle } from 'lucide-react';

interface SystemMetrics {
  errorRate: number;
  gasPrice: number;
  tvlChange1h: number;
  totalValueLocked: string;
  isPaused: boolean;
  lastCheck: string;
}

export function EmergencyControls() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    errorRate: 0,
    gasPrice: 0,
    tvlChange1h: 0,
    totalValueLocked: '0',
    isPaused: false,
    lastCheck: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const handleEmergencyPause = async () => {
    if (!confirm('Are you sure you want to PAUSE all contracts? This will stop all deposits and withdrawals.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/emergency-pause', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Emergency pause initiated! All contracts will be paused pending multi-sig confirmation.');
        fetchSystemMetrics();
      } else {
        throw new Error('Failed to pause');
      }
    } catch (error) {
      console.error('Emergency pause failed:', error);
      alert('Failed to pause system. Please try again or pause contracts manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpause = async () => {
    if (!confirm('Are you sure you want to UNPAUSE all contracts?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/admin/unpause', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Unpause initiated! Contracts will resume pending multi-sig confirmation.');
        fetchSystemMetrics();
      }
    } catch (error) {
      console.error('Unpause failed:', error);
      alert('Failed to unpause system.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricStatus = (value: number, threshold: number, inverse = false) => {
    const isWarning = inverse ? value < threshold : value > threshold;
    return isWarning ? 'warning' : 'normal';
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Emergency Controls</h1>
        <p className="text-muted-foreground">System health monitoring and emergency pause controls</p>
      </div>

      {/* System Status */}
      <Card className={metrics.isPaused ? 'border-red-500 border-2' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>System Status</span>
            {metrics.isPaused ? (
              <Badge variant="destructive" className="text-base">
                <AlertCircle className="mr-2 h-4 w-4" />
                PAUSED
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-600 text-base">
                <CheckCircle className="mr-2 h-4 w-4" />
                ACTIVE
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Last updated: {new Date(metrics.lastCheck).toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.isPaused && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>System Paused</AlertTitle>
              <AlertDescription>
                All deposits and withdrawals are currently disabled. Unpause the system when issues are resolved.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Error Rate */}
            <MetricCard
              icon={AlertCircle}
              title="Error Rate"
              value={`${(metrics.errorRate * 100).toFixed(2)}%`}
              status={getMetricStatus(metrics.errorRate, 0.05)}
              threshold="< 5%"
              description="HTTP 5xx errors / total requests"
            />

            {/* Gas Price */}
            <MetricCard
              icon={Zap}
              title="Gas Price"
              value={`${metrics.gasPrice} Gwei`}
              status={getMetricStatus(metrics.gasPrice, 500)}
              threshold="< 500 Gwei"
              description="Current Ethereum network gas price"
            />

            {/* TVL Change */}
            <MetricCard
              icon={TrendingDown}
              title="TVL Change (1h)"
              value={`${metrics.tvlChange1h > 0 ? '+' : ''}${metrics.tvlChange1h.toFixed(2)}%`}
              status={getMetricStatus(metrics.tvlChange1h, -10, true)}
              threshold="> -10%"
              description="Change in total value locked"
            />

            {/* Total TVL */}
            <MetricCard
              icon={Shield}
              title="Total Value Locked"
              value={`$${Number(metrics.totalValueLocked).toLocaleString()}`}
              status="normal"
              description="Current TVL across all vaults"
            />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Actions</CardTitle>
          <CardDescription>
            Critical system controls - requires multi-sig confirmation in production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!metrics.isPaused ? (
            <div>
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>⚠️ Use Only in Emergency</AlertTitle>
                <AlertDescription>
                  Pausing will stop all user deposits and withdrawals immediately. Only use if you have detected a critical security issue or exploit.
                </AlertDescription>
              </Alert>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleEmergencyPause}
                disabled={isLoading}
                className="w-full"
              >
                <AlertCircle className="mr-2 h-5 w-5" />
                Emergency Pause All Contracts
              </Button>
            </div>
          ) : (
            <div>
              <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>System Paused</AlertTitle>
                <AlertDescription>
                  Verify that all issues are resolved before unpausing. Users cannot deposit or withdraw while paused.
                </AlertDescription>
              </Alert>

              <Button
                variant="default"
                size="lg"
                onClick={handleUnpause}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Unpause System
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>✓ Actions require multi-sig approval in production</p>
            <p>✓ All emergency actions are logged in audit trail</p>
            <p>✓ Team will be notified via Slack/Discord</p>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Pause Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Pause Circuit Breakers</CardTitle>
          <CardDescription>
            System will automatically pause if these conditions are met
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <CircuitBreakerRule
              title="High Error Rate"
              condition="Error rate > 5%"
              action="Emergency pause"
              enabled={true}
            />
            <CircuitBreakerRule
              title="TVL Drop"
              condition="TVL drops > 10% in 1 hour"
              action="Emergency pause"
              enabled={true}
            />
            <CircuitBreakerRule
              title="Gas Spike"
              condition="Gas price > 500 Gwei"
              action="Alert team"
              enabled={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon: Icon,
  title,
  value,
  status,
  threshold,
  description,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  status: 'normal' | 'warning';
  threshold?: string;
  description?: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${status === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 ${status === 'warning' ? 'text-yellow-600' : 'text-gray-600'}`} />
        {status === 'warning' && (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {threshold && (
          <p className="text-xs text-muted-foreground">Threshold: {threshold}</p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

// Circuit Breaker Rule Component
function CircuitBreakerRule({
  title,
  condition,
  action,
  enabled,
}: {
  title: string;
  condition: string;
  action: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">
          <strong>If:</strong> {condition}
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Then:</strong> {action}
        </p>
      </div>
      <Badge variant={enabled ? 'default' : 'secondary'}>
        {enabled ? 'Enabled' : 'Disabled'}
      </Badge>
    </div>
  );
}
