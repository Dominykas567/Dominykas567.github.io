document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.php-email-form');
  if (!form) return;

  const firstName = form.querySelector('input[name="firstName"]');
  const lastName  = form.querySelector('input[name="lastName"]');
  const email     = form.querySelector('input[name="email"]');
  const phone     = form.querySelector('input[name="phone"]');
  const address   = null; 
  const q1 = form.querySelector('input[name="q1"]');
  const q2 = form.querySelector('input[name="q2"]');
  const q3 = form.querySelector('input[name="q3"]');

  const output = document.getElementById('form-output');
  const popup = document.getElementById('success-popup');
  const submitBtn = form.querySelector('button[type="submit"]');

  function ensureErrorEl(input){
    if (!input) return null;
    let el = input.parentElement.querySelector('.error-text');
    if (!el){
      el = document.createElement('div');
      el.className = 'error-text';
      el.style.color = 'red';
      el.style.fontSize = '0.9rem';
      el.style.marginTop = '4px';
      input.parentElement.appendChild(el);
    }
    return el;
  }

  function setInvalid(input, message){
    if (!input) return;
    input.classList.add('is-invalid');
    const err = ensureErrorEl(input);
    if (err) err.textContent = message || 'Netinkama reikšmė';
  }

  function clearInvalid(input){
    if (!input) return;
    input.classList.remove('is-invalid');
    const err = input.parentElement.querySelector('.error-text');
    if (err) err.textContent = '';
  }

  const validators = {
    firstName: val => {
      if (!val) return 'Vardas privalomas';
      if (!/^[A-Za-zĄČĘĖĮŠŲŪąčęėįšųū\- ]+$/.test(val)) return 'Varde gali būti tik raidės ir brūkšnelis';
      return '';
    },
    lastName: val => {
      if (!val) return 'Pavardė privaloma';
      if (!/^[A-Za-zĄČĘĖĮŠŲŪąčęėįšųū\- ]+$/.test(val)) return 'Pavardėje gali būti tik raidės ir brūkšnelis';
      return '';
    },
    email: val => {
      if (!val) return 'El. paštas privalomas';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Neteisingas el. pašto formatas';
      return '';
    },
    phone: val => {
      const digits = (val || '').replace(/\D/g,'');
      if (!digits) return 'Telefono numeris privalomas';
      if (!/^6\d{7}$/.test(digits) && !/^3706\d{7}$/.test(digits)) return 'Įveskite numerį lietuvišku formatu: +370 6xx xxxxx';
      return '';
    },
    q: val => {
      if (val === '' || val === null || typeof val === 'undefined') return 'Reikšmė privaloma';
      const n = Number(val);
      if (Number.isNaN(n) || n < 1 || n > 10) return 'Reikšmė turi būti 1–10';
      return '';
    }
  };

  function validateField(input){
    if (!input) return true;
    let name = input.getAttribute('name');
    let value = input.value.trim();
    let err = '';
    if (name === 'firstName') err = validators.firstName(value);
    else if (name === 'lastName') err = validators.lastName(value);
    else if (name === 'email') err = validators.email(value);
    else if (name === 'phone') err = validators.phone(value);
    else if (['q1','q2','q3'].includes(name)) err = validators.q(value);
    if (err) { setInvalid(input, err); return false; }
    clearInvalid(input);
    return true;
  }

  phone && phone.addEventListener('input', (e) => {
    const raw = phone.value;
    const digits = raw.replace(/\D/g,'');
    let d = digits;
    if (d.startsWith('370')) {
      d = d.slice(3);
    } else if (d.startsWith('0')) {
      if (d.startsWith('06')) d = d.slice(1);
    }
    d = d.slice(0,8);
    let display = '';
    if (d.length === 0) {
      display = '';
    } else if (d.length <= 1) {
      display = '+370 ' + d;
    } else if (d.length <= 3) {
      display = '+370 ' + d.slice(0,1) + d.slice(1);
    } else if (d.length <= 4) {
      display = '+370 ' + d.slice(0,1) + d.slice(1,4);
    } else {
      const part1 = d.slice(0,1);
      const part2 = d.slice(1,3);
      const part3 = d.slice(3);
      display = '+370 ' + part1 + (part2 ? part2 : '') + (part3 ? ' ' + part3 : '');
    }
    phone.value = display;
    validateField(phone);
    toggleSubmit();
  });

  phone && phone.addEventListener('keydown', (e) => {
    const allowed = ['Backspace','ArrowLeft','ArrowRight','Delete','Tab','Home','End'];
    if (allowed.includes(e.key)) return;
    if ((e.ctrlKey || e.metaKey) && ['a','c','v','x'].includes(e.key.toLowerCase())) return;
    if (/\d/.test(e.key)) return;
    e.preventDefault();
  });

  [firstName, lastName, email, q1, q2, q3].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      validateField(inp);
      toggleSubmit();
    });
    inp.addEventListener('blur', () => validateField(inp));
  });

  function allValid(){
    const fields = [firstName, lastName, email, phone, q1, q2, q3];
    let ok = true;
    fields.forEach(f => {
      if (!f) { ok = false; return; }
      const v = validateField(f);
      if (!v) ok = false;
    });
    return ok;
  }

  function toggleSubmit(){
    if (!submitBtn) return;
    if (allValid()) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('disabled');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('disabled');
    }
  }

  if (submitBtn) {
    submitBtn.type = 'button'; 
    submitBtn.disabled = true;
    submitBtn.classList.add('disabled');
  }

  function computeAverage(a,b,c){
    const nums = [Number(a), Number(b), Number(c)];
    const avg = nums.reduce((s,x)=>s+x,0)/3;
    return Math.round(avg * 10) / 10; 
  }

  function renderOutput(data){
    if (!output) return;
    const avg = computeAverage(data.q1, data.q2, data.q3);
    const lines = [
      `Vardas: ${data.firstName}`,
      `Pavardė: ${data.lastName}`,
      `El. paštas: ${data.email}`,
      `Tel. Numeris: ${data.phone}`,
      '',
      `${data.firstName} ${data.lastName}: ${avg}`
    ];
    output.innerHTML = lines.map(l => `<div>${escapeHtml(l)}</div>`).join('');
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      if (!allValid()) {
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      const data = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        q1: q1.value.trim(),
        q2: q2.value.trim(),
        q3: q3.value.trim(),
      };
      console.log('Kontaktų formos duomenys:', data);

      renderOutput(data);

      if (popup) {
        popup.style.display = 'block';
        popup.setAttribute('aria-hidden','false');
        setTimeout(()=> {
          popup.style.display = 'none';
          popup.setAttribute('aria-hidden','true');
        }, 4000);
      }
    });
  }

  toggleSubmit();

  [firstName, lastName, email, phone, q1, q2, q3].forEach(i=> {
    if (i) i.removeAttribute('required');
  });

});
