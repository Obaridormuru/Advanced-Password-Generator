'use client'

import { useState, useEffect } from 'react'
import { Copy, RefreshCw, Shield, Eye, EyeOff, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { generatePassword, calculatePasswordStrength, type PasswordConfig, type PasswordHistory } from '@/lib/password-utils'

export function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [config, setConfig] = useState<PasswordConfig>(() => {
    const savedConfig = localStorage.getItem('passwordConfig')
    return savedConfig ? JSON.parse(savedConfig) : {
      length: 16,
      includeNumbers: true,
      includeSymbols: true,
      includeUppercase: true,
    }
  })
  const [history, setHistory] = useState<PasswordHistory[]>(() => {
    const savedHistory = localStorage.getItem('passwordHistory')
    return savedHistory ? JSON.parse(savedHistory) : []
  })
  const [strength, setStrength] = useState({ score: 0, feedback: '' })

  useEffect(() => {
    localStorage.setItem('passwordConfig', JSON.stringify(config))
  }, [config])

  useEffect(() => {
    localStorage.setItem('passwordHistory', JSON.stringify(history))
  }, [history])

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(config)
    setPassword(newPassword)
    const newStrength = calculatePasswordStrength(newPassword)
    setStrength(newStrength)
    setHistory(prev => [...prev.slice(-4), { 
      password: newPassword, 
      timestamp: new Date(), 
      strength: newStrength.score 
    }])
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Password copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy password')
    }
  }

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear the password history?')) {
      setHistory([])
      toast.success('Password history cleared')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">
          Password Generator
          <Shield className="icon" />
        </h1>
        <p className="card-description">Generate secure, random passwords</p>
      </div>

      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          readOnly
          className="password-input"
          placeholder="Click generate to create password"
        />
        <div className="button-group">
          <button 
            className="icon-button"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
          <button
            className="icon-button"
            onClick={() => password && copyToClipboard(password)}
            title="Copy to clipboard"
            disabled={!password}
          >
            <Copy />
          </button>
        </div>
      </div>

      {password && (
        <div className="fade-in">
          <p className="feedback">{strength.feedback}</p>
          <div className="strength-meter">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`strength-segment ${i < strength.score ? `active-${strength.score}` : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="controls">
        <div className="control-group">
          <label className="label">
            Password Length: {config.length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={config.length}
            onChange={(e) => setConfig({ ...config, length: Number(e.target.value) })}
            className="range-slider"
          />
        </div>

        <div className="control-group">
          <label className="label">Include Numbers</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={config.includeNumbers}
              onChange={(e) => setConfig({ ...config, includeNumbers: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="control-group">
          <label className="label">Include Symbols</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={config.includeSymbols}
              onChange={(e) => setConfig({ ...config, includeSymbols: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="control-group">
          <label className="label">Include Uppercase</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={config.includeUppercase}
              onChange={(e) => setConfig({ ...config, includeUppercase: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <button className="generate-button" onClick={handleGeneratePassword}>
        <RefreshCw />
        Generate Password
      </button>

      {history.length > 0 && (
        <div className="history">
          <div className="history-header">
            <span className="history-title">Recent Passwords</span>
            <button className="icon-button" onClick={clearHistory}>
              <Trash2 />
            </button>
          </div>
          {history.map((item, i) => (
            <div key={item.timestamp.toString()} className="history-item fade-in">
              <span className="history-password">
                {showPassword ? item.password : '•'.repeat(item.password.length)}
              </span>
              <div className="history-actions">
                <div 
                  className="strength-indicator"
                  style={{
                    backgroundColor: 
                      item.strength === 4 ? 'var(--success-color)' :
                      item.strength === 3 ? 'var(--primary-color)' :
                      item.strength === 2 ? 'var(--warning-color)' :
                      'var(--error-color)'
                  }}
                />
                <button
                  className="icon-button"
                  onClick={() => copyToClipboard(item.password)}
                >
                  <Copy />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

