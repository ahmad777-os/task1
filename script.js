
const rules = {
  firstName: {
    el: document.getElementById('firstName'),
    validate(v) {
      if (!v) return 'First name is required.';
      if (v.length < 2) return 'Must be at least 2 characters.';
      if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'Only letters are allowed.';
      return '';
    }
  },
  lastName: {
    el: document.getElementById('lastName'),
    validate(v) {
      if (!v) return 'Last name is required.';
      if (v.length < 2) return 'Must be at least 2 characters.';
      return '';
    }
  },
  email: {
    el: document.getElementById('email'),
    validate(v) {
      if (!v) return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        return 'Enter a valid email (e.g. you@domain.com).';
      }
      const username = v.split('@')[0];
      if (/^\d+$/.test(username)) {
        return 'Email cannot be only numbers.';
      }
      if (username.length < 3) {
        return 'Email username must be at least 3 characters.';
      }
      if (!/[a-zA-Z]/.test(username)) {
        return 'Email must contain at least one letter.';
      }
      return '';
    }
  },
  phone: {
    el: document.getElementById('phone'),
    validate(v) {
      if (!v) return 'Phone number is required.';
      if (!/^\+?[\d\s\-()]{7,15}$/.test(v)) return 'Enter a valid phone number.';
      return '';
    }
  },
  dob: {
    el: document.getElementById('dob'),
    validate(v) {
      if (!v) return 'Date of birth is required.';
      const age = (new Date() - new Date(v)) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 13) return 'You must be at least 13 years old to register.';
      if (age > 120) return 'Please enter a valid date of birth.';
      return '';
    }
  },
  password: {
    el: document.getElementById('password'),
    validate(v) {
      if (!v) return 'Password is required.';
      if (v.length < 8) return 'Password must be at least 8 characters long.';
      if (!/[A-Z]/.test(v)) return 'Include at least one uppercase letter (A–Z).';
      if (!/[0-9]/.test(v)) return 'Include at least one number (0–9).';
      return '';
    }
  },
  confirm: {
    el: document.getElementById('confirm'),
    validate(v) {
      if (!v) return 'Please confirm your password.';
      if (v !== document.getElementById('password').value) return 'Passwords do not match. Try again.';
      return '';
    }
  }
};

function applyState(key, error) {
  const el = rules[key].el;
  const errEl = document.getElementById('err-' + key);
  const icon = document.getElementById('fi-' + key);
  if (error) {
    el.className = 'invalid';
    errEl.textContent = error;
    errEl.className = 'error-msg visible';
    icon.textContent = '✕';
    icon.className = 'field-icon show err';
  } else if (el.value) {
    el.className = 'valid';
    errEl.textContent = '';
    errEl.className = 'error-msg';
    icon.textContent = '✓';
    icon.className = 'field-icon show ok';
  }
}

Object.keys(rules).forEach(key => {
  rules[key].el.addEventListener('input', () => {
    applyState(key, rules[key].validate(rules[key].el.value.trim()));
    if (key === 'password') updateStrength(rules[key].el.value);
  });
  rules[key].el.addEventListener('blur', () => {
    applyState(key, rules[key].validate(rules[key].el.value.trim()));
  });
});

function updateStrength(pwd) {
  const fill = document.getElementById('strengthFill');
  const label = document.getElementById('strengthLabel');
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const info = [
    { w: '15%', c: '#e74c3c', t: 'Very weak' },
    { w: '40%', c: '#e67e22', t: 'Weak' },
    { w: '70%', c: '#f1c40f', t: 'Good' },
    { w: '100%', c: '#2e7d57', t: 'Strong' },
  ];
  if (pwd) {
    const s = info[score - 1] || info[0];
    fill.style.width = s.w; fill.style.background = s.c;
    label.textContent = 'Strength: ' + s.t;
  } else {
    fill.style.width = '0'; label.textContent = '';
  }
}

document.getElementById('regForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let allValid = true;
  Object.keys(rules).forEach(key => {
    const err = rules[key].validate(rules[key].el.value.trim());
    applyState(key, err);
    if (err) allValid = false;
  });
  if (allValid) {
    document.getElementById('successMsg').classList.add('show');
    this.reset();
    Object.keys(rules).forEach(key => {
      rules[key].el.className = '';
      document.getElementById('fi-' + key).className = 'field-icon';
    });
    document.getElementById('strengthFill').style.width = '0';
    document.getElementById('strengthLabel').textContent = '';
  }
});