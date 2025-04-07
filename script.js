//https://script.google.com/macros/s/AKfycbzWF2iYrp7gQxxDeQmmTRxDfLClRGIL5twTiFsMEYbfYhSBZu-cTMOsPA4at8qyX3GoIw/exec
const apiUrl = "https://script.google.com/macros/s/AKfycbwuvtBuq1X2I4MoBnvYMb4l9_kAF9JfrEa8_M02LNK7JJJhsOt7iXC8sfJaYU26DM1rVw/exec"; // 替換為你的 API 網址

const form = document.getElementById("recordForm");
const recordsContainer = document.getElementById("records");

// 讀取 Google Sheets 的記帳紀錄並顯示
async function loadRecords() {
    try {
        const response = await fetch(apiUrl); // `GET` 請求 API
        const data = await response.json();   // 解析 JSON

        recordsContainer.innerHTML = ""; // 清空舊資料

        for (let i = 1; i < data.length; i++) { // 跳過標題列
            const [date, category, amount, note] = data[i];

            const recordElement = document.createElement("div");
            recordElement.classList.add("record");
            recordElement.innerHTML = `
                <p><strong>日期：</strong>${date}</p>
                <p><strong>類別：</strong>${category}</p>
                <p><strong>金額：</strong>${amount}</p>
                <p><strong>備註：</strong>${note}</p>
            `;
            recordsContainer.appendChild(recordElement);
        }
    } catch (error) {
        console.error("讀取紀錄時發生錯誤：", error);
    }
}

// 新增記帳資料
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = Number(document.getElementById("amount").value);
    const note = document.getElementById("note").value;

    const newRecord = { date, category, amount, note };

    await fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify(newRecord),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors"  // 避免 CORS 錯誤
    });

    form.reset();
    alert("記帳成功！（請到 Google Sheets 查看資料）");

    // **重新載入紀錄，確保新資料即時顯示**
    setTimeout(loadRecords, 2000); // 等 2 秒後重新載入資料
});

// **網頁載入時自動載入記帳紀錄**
window.addEventListener("load", loadRecords);



//**痾 gpt 說增加取消功能 */
const recordForm = document.getElementById('recordForm');
const recordsDiv = document.getElementById('records');
const filterSelect = document.getElementById('filter');
const totalDiv = document.getElementById('total');

let records = [];

recordForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const note = document.getElementById('note').value;

    const record = {
        id: Date.now(),
        date,
        category,
        amount,
        note
    };

    records.push(record);
    renderRecords();
    recordForm.reset();
});

filterSelect.addEventListener('change', renderRecords);

function renderRecords() {
    const filter = filterSelect.value;
    recordsDiv.innerHTML = '';

    const filteredRecords = filter === '全部'
        ? records
        : records.filter(record => record.category === filter);

    filteredRecords.forEach(record => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record';

        recordDiv.innerHTML = `
            <button class="delete-btn" onclick="deleteRecord(${record.id})">❌</button>
            <strong>${record.date}</strong> - ${record.category} - $${record.amount}<br>
            備註：${record.note || '無'}<br>
            <button class="edit-btn" onclick="editRecord(${record.id})">修改</button>
        `;

        recordsDiv.appendChild(recordDiv);
    });

    // 更新總金額
    const total = filteredRecords.reduce((sum, r) => sum + r.amount, 0);
    totalDiv.innerHTML = `總金額：$${total}`;
}

function deleteRecord(id) {
    records = records.filter(record => record.id !== id);
    renderRecords();
}

function editRecord(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;

    document.getElementById('date').value = record.date;
    document.getElementById('category').value = record.category;
    document.getElementById('amount').value = record.amount;
    document.getElementById('note').value = record.note;

    records = records.filter(r => r.id !== id);
    renderRecords();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
