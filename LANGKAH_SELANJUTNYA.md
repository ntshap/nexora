# ✅ APA YANG HARUS KAMU LAKUKAN SEKARANG

## STATUS SEKARANG
- ✅ Semua code sudah dibuat (21 files)
- ✅ Semua error sudah diperbaiki (5 files fixed)
- ✅ Backend routing sudah diintegrate
- ✅ Middleware compliance sudah ditambahkan

---

## 🚀 LANGKAH-LANGKAH YANG HARUS DILAKUKAN

### **STEP 1: Setup Environment Variables** ⚠️ WAJIB

```bash
# Di root folder project (nexora/)
cp .env.example .env
```

Lalu edit file `.env` dan isi variabel ini (WAJIB):

```bash
# Admin wallets - ganti dengan wallet address kamu
ADMIN_WALLETS=0xYourWalletAddressHere

# Database - pilih salah satu
DATABASE_URL=sqlite:///./nexora.db  # Untuk development
# atau
DATABASE_URL=postgresql://user:password@localhost:5432/nexora  # Untuk production

# Blockchain
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_ID
VAULT_ADDRESS=0xYourDeployedVaultAddress

# Alerts - OPTIONAL tapi recommended
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK
```

---

### **STEP 2: Install Backend Dependencies** ⚠️ WAJIB

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Atau jika pakai virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# atau
.venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

---

### **STEP 3: Setup Database** ⚠️ WAJIB

```bash
# Masih di folder backend/

# Generate migration untuk tables baru
alembic revision --autogenerate -m "Add legal compliance tables"

# Apply migration ke database
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Running upgrade -> abc123, Add legal compliance tables
```

---

### **STEP 4: Start Backend Server** ⚠️ WAJIB

```bash
# Masih di folder backend/
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test:** Buka browser ke http://127.0.0.1:8000/docs
- Kamu harusnya lihat API docs dengan endpoint baru:
  - `/api/v1/legal/accept-terms`
  - `/api/v1/legal/check-acceptance/{address}`
  - `/api/v1/legal/gdpr/export/{address}`
  - `/api/v1/admin/metrics`
  - `/api/v1/admin/emergency-pause`

---

### **STEP 5: Install Frontend Dependencies** ⚠️ WAJIB

Buka **terminal baru** (jangan tutup backend):

```bash
cd apps/web

# Install dependencies
npm install
```

---

### **STEP 6: Update Frontend .env** ⚠️ WAJIB

```bash
# Di folder apps/web/
# Buat file .env.local
```

Isi dengan:
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_ADMIN_WALLETS=0xYourAdminWalletHere
```

---

### **STEP 7: Start Frontend** ⚠️ WAJIB

```bash
# Masih di folder apps/web/
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

### **STEP 8: Test Compliance Flow** ✅ TEST

1. **Buka browser:** http://localhost:3000

2. **Yang harusnya muncul:**
   - ✅ Modal "Age Verification" (confirm umur 18+)
   - ✅ Setelah konfirmasi → Modal "Terms of Service"
   - ✅ Scroll sampai bawah → Centang 4 checkboxes
   - ✅ Accept → Masuk ke aplikasi

3. **Test transaction warning:**
   - Cari tombol deposit/withdraw
   - Klik → Harusnya muncul "Transaction Risk Warning"
   - Centang checkbox → Confirm

4. **Test admin dashboard:**
   - Buka: http://localhost:3000/admin
   - Harusnya lihat Emergency Controls dashboard
   - 4 metrics cards
   - Emergency Pause button

---

## ⚠️ TROUBLESHOOTING

### Error: "Module not found"
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd apps/web
npm install
```

### Error: "alembic: command not found"
```bash
pip install alembic
```

### Error: "Cannot connect to database"
```bash
# Cek .env file
# Pastikan DATABASE_URL sudah benar

# Untuk development, pakai SQLite:
DATABASE_URL=sqlite:///./nexora.db
```

### Error: "Port already in use"
```bash
# Backend - ganti port
uvicorn app.main:app --reload --port 8001

# Frontend - ganti port
npm run dev -- -p 3001
```

### Warning: "Import could not be resolved" di VS Code
**Ini BUKAN error!** Cuma VS Code warning, code tetap jalan.

Fix (optional):
1. Ctrl+Shift+P
2. "Python: Select Interpreter"
3. Pilih dari `backend/.venv/bin/python`

---

## 📋 CHECKLIST

Pastikan semua langkah ini sudah:

- [ ] File `.env` sudah dibuat dan diisi
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migration dijalankan (`alembic upgrade head`)
- [ ] Backend server running (http://127.0.0.1:8000)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend `.env.local` sudah dibuat
- [ ] Frontend running (http://localhost:3000)
- [ ] Test compliance flow berhasil
- [ ] Admin dashboard bisa diakses

---

## ✅ JIKA SEMUA BERHASIL

Kamu harusnya lihat:

1. **Homepage:** Age verification modal
2. **Setelah verify:** Terms acceptance modal
3. **Setelah accept:** Aplikasi normal
4. **Pada setiap transaksi:** Risk warning modal
5. **Di /admin:** Emergency controls dashboard dengan real-time metrics

---

## 🆘 BUTUH BANTUAN?

Jika ada error, share:
1. **Screenshot error message**
2. **Output dari terminal** (copy paste)
3. **File mana yang error** (nama file + line number)

Saya akan bantu fix! 🚀
