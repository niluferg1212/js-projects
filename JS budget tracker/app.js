// ===== MODÜLLER =====
const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });

// ===== SABİT TANIMLARI =====
const USER_FILE = "usersjs.csv"; // İstersen "usersjs.csv" yapabilirsin

// ===== DOSYA OLUŞTURMA =====
try {
    if (!fs.existsSync(USER_FILE)) {
        fs.writeFileSync(USER_FILE, "");
        console.log(`${USER_FILE} oluşturuldu.`);
    }
} catch (error) {
    console.error(`Dosya oluşturma hatası: ${error.message}`);
    process.exit(1);
}

// ===== TEST KULLANICI EKLEME =====
function registerTestUser() {
    try {
        if (!fs.existsSync(USER_FILE)) {
            fs.writeFileSync(USER_FILE, "");
        }
        const data = fs.readFileSync(USER_FILE, 'utf-8').trim().split('\n').filter(row => row.length > 0);
        const exists = data.some(row => row.split(',')[0] === "testuser");
        if (!exists) {
            fs.appendFileSync(USER_FILE, "testuser,test123\n");
            console.log("Test kullanıcı eklendi: testuser, test123");
        }
    } catch (error) {
        console.error(`Test kullanıcı ekleme hatası: ${error.message}`);
    }
}

// ===== YENİ KULLANICI KAYDI =====
function registerUser(username, password) {
    try {
        const data = fs.readFileSync(USER_FILE, 'utf-8').trim().split('\n').filter(row => row.length > 0);
        const exists = data.some(row => row.split(',')[0] === username);
        if (!exists) {
            fs.appendFileSync(USER_FILE, `${username},${password}\n`);
            console.log(`Kullanıcı eklendi: ${username},${password}`);
        } else {
            console.log("Bu kullanıcı zaten mevcut.");
        }
    } catch (error) {
        console.error(`Kayıt hatası: ${error.message}`);
    }
}

// ===== GİRİŞ FONKSİYONU =====
function login(username, password) {
    try {
        if (!fs.existsSync(USER_FILE)) return false;
        const data = fs.readFileSync(USER_FILE, 'utf-8').trim().split('\n').filter(row => row.length > 0);
        for (const row of data) {
            const [storedUser, storedPass] = row.split(',');
            if (storedUser && storedPass && storedUser.trim() === username.trim() && storedPass.trim() === password.trim()) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(`Giriş kontrolü hatası: ${error.message}`);
        return false;
    }
}

// ===== PROGRAMI BAŞLAT =====
registerTestUser();

// ===== KAYIT VE GİRİŞ ARAYÜZÜ =====
console.log("1: Kayıt Ol\n2: Giriş Yap");
const choice = prompt("Seçenek seçin (1 veya 2): ");

if (choice === "1") {
    console.log("Yeni kullanıcı kaydı:");
    const newUsername = prompt("Yeni kullanıcı adı: ");
    const newPassword = prompt("Yeni şifre: ");
    registerUser(newUsername, newPassword);
} else if (choice === "2") {
    console.log("Kullanıcı adı ve şifre girin:");
    const usernameInput = prompt("Kullanıcı adı: ");
    const passwordInput = prompt("Şifre: ");
    if (login(usernameInput, passwordInput)) {
        console.log("Giriş başarılı!");
    } else {
        console.log("Giriş başarısız.");
    }
} else {
    console.log("Geçersiz seçenek!");
}