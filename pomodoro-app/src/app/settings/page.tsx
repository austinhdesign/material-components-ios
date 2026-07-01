'use client'
import { useSettingsStore } from '@/stores/settingsStore'
import { TIMER_PRESETS } from '@/constants/timerPresets'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'
import { Sun, Moon, Monitor, Download, Upload, RotateCcw } from 'lucide-react'
import type { ThemeMode } from '@/types/settings'
import { exportAllData, importAllData } from '@/services/exportService'
import { useRef, useState } from 'react'

export default function SettingsPage() {
  const { settings, updateSettings, setActivePreset, updateCustomPreset, resetToDefaults } = useSettingsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleExport = async () => {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pomodoro-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!confirm('This will overwrite all existing data. Are you sure?')) return
    try {
      const text = await file.text()
      await importAllData(text)
      setImportStatus('success')
      setTimeout(() => setImportStatus('idle'), 3000)
    } catch {
      setImportStatus('error')
      setTimeout(() => setImportStatus('idle'), 3000)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all settings to defaults? This cannot be undone.')) return
    await resetToDefaults()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Customize your Pomodoro experience</p>
      </div>

      {/* Timer Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timer Preset</CardTitle>
          <CardDescription>Choose a preset that matches your work style</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIMER_PRESETS.map(preset => {
              const isActive = settings.activePresetId === preset.id
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset.id)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-all',
                    isActive
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-[var(--border)] hover:border-[var(--ring)]'
                  )}
                >
                  <p className="font-medium text-sm">{preset.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {preset.focusDuration / 60}m / {preset.shortBreakDuration / 60}m / {preset.longBreakDuration / 60}m
                  </p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Timer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Custom Timer</CardTitle>
          <CardDescription>Set your own durations (in minutes)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Focus', key: 'focusDuration' as const, value: settings.customPreset.focusDuration / 60 },
              { label: 'Short Break', key: 'shortBreakDuration' as const, value: settings.customPreset.shortBreakDuration / 60 },
              { label: 'Long Break', key: 'longBreakDuration' as const, value: settings.customPreset.longBreakDuration / 60 },
              { label: 'Sessions/Cycle', key: 'sessionsBeforeLongBreak' as const, value: settings.customPreset.sessionsBeforeLongBreak },
            ].map(({ label, key, value }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-xs">{label}</Label>
                <Input
                  id={key}
                  type="number"
                  min={1}
                  max={key === 'sessionsBeforeLongBreak' ? 10 : 180}
                  value={value}
                  onChange={e => {
                    const v = parseInt(e.target.value)
                    if (isNaN(v)) return
                    updateCustomPreset({
                      [key]: key === 'sessionsBeforeLongBreak' ? v : v * 60
                    })
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Behavior</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'autoStartBreaks' as const, label: 'Auto-start breaks', description: 'Automatically begin breaks after focus sessions' },
            { key: 'autoStartFocus' as const, label: 'Auto-start focus', description: 'Automatically begin focus after breaks' },
            { key: 'showSessionReflection' as const, label: 'Session reflection', description: 'Prompt to rate focus quality after each session' },
            { key: 'showMorningPlanning' as const, label: 'Morning planning', description: 'Show planning modal when you start your day' },
            { key: 'showTimerInTitle' as const, label: 'Timer in tab title', description: 'Show countdown in the browser tab title' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor={key} className="font-medium cursor-pointer">{label}</Label>
                <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
              </div>
              <Switch
                id={key}
                checked={settings[key] as boolean}
                onCheckedChange={checked => updateSettings({ [key]: checked })}
              />
            </div>
          ))}

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="dailyGoal">Daily session goal</Label>
            <Input
              id="dailyGoal"
              type="number"
              min={1}
              max={20}
              value={settings.dailySessionGoal}
              onChange={e => updateSettings({ dailySessionGoal: parseInt(e.target.value) || 8 })}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sound</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="soundEnabled">Enable sounds</Label>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={checked => updateSettings({ soundEnabled: checked })}
            />
          </div>
          {settings.soundEnabled && (
            <>
              <div className="space-y-2">
                <Label>Volume: {Math.round(settings.volume * 100)}%</Label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={([v]) => updateSettings({ volume: v })}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tickSound">Tick sound</Label>
                <Switch
                  id="tickSound"
                  checked={settings.tickSoundEnabled}
                  onCheckedChange={checked => updateSettings({ tickSoundEnabled: checked })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {([
                { mode: 'light' as ThemeMode, icon: Sun, label: 'Light' },
                { mode: 'dark' as ThemeMode, icon: Moon, label: 'Dark' },
                { mode: 'system' as ThemeMode, icon: Monitor, label: 'System' },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => updateSettings({ theme: mode })}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                    settings.theme === mode
                      ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'border-[var(--border)] hover:border-[var(--ring)]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data</CardTitle>
          <CardDescription>Export, import, or reset your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export data
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="w-4 h-4" />
              Import data
            </Button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            <Button variant="destructive" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset settings
            </Button>
          </div>
          {importStatus === 'success' && <p className="text-sm text-emerald-600">Data imported successfully!</p>}
          {importStatus === 'error' && <p className="text-sm text-red-600">Import failed. Invalid data format.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
