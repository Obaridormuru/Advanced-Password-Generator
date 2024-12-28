export function generatePassword(config: PasswordConfig): string {
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
    // Ensure at least one character from each selected type
    let password = ''
    if (config.includeNumbers) password += numbers[Math.floor(Math.random() * numbers.length)]
    if (config.includeSymbols) password += symbols[Math.floor(Math.random() * symbols.length)]
    if (config.includeUppercase) password += uppercase[Math.floor(Math.random() * uppercase.length)]
    
    // Build character set for remaining length
    let chars = lowercase
    if (config.includeNumbers) chars += numbers
    if (config.includeSymbols) chars += symbols
    if (config.includeUppercase) chars += uppercase
  
    // Fill remaining length
    const remainingLength = config.length - password.length
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      password += chars[randomIndex]
    }
  
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
  
  export function calculatePasswordStrength(password: string): {
    score: number
    feedback: string
  } {
    let score = 0
    let feedback = ''
  
    // Length check
    if (password.length < 8) {
      feedback = 'Too short'
    } else if (password.length >= 12) {
      score += 1
    }
  
    // Character variety checks
    if (/[0-9]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
  
    // Common patterns check
    if (/(\w)\1+/.test(password)) {
      score -= 1
      feedback = 'Avoid repeated characters'
    }
  
    if (/^[0-9]+$/.test(password)) {
      score -= 1
      feedback = 'Avoid using only numbers'
    }
  
    // Sequential characters check
    if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/.test(password.toLowerCase())) {
      score -= 1
      feedback = 'Avoid sequential characters'
    }
  
    // Final score calculation
    score = Math.max(0, Math.min(4, score))
    
    if (!feedback) {
      feedback = score === 4 ? 'Excellent password!' :
                score === 3 ? 'Strong password' :
                score === 2 ? 'Moderate password' :
                'Weak password'
    }
  
    return { score, feedback }
  }
  
  export interface PasswordConfig {
    length: number
    includeNumbers: boolean
    includeSymbols: boolean
    includeUppercase: boolean
  }
  
  export interface PasswordHistory {
    password: string
    timestamp: Date
    strength: number
  }
  
  