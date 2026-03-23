const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const path    = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

/* ══════ WORD BANK ══════ */
const WORDS = {
  '🐾 สัตว์': [
    'แมว','หมา','ช้าง','เสือ','สิงโต','กวาง','หมี','ลิง','นก','ปลา','ฉลาม','วาฬ','โลมา',
    'กระต่าย','ม้า','วัว','แพะ','แกะ','หมู','ไก่','เป็ด','งู','จระเข้','เต่า','กบ','คางคก',
    'ยีราฟ','ม้าลาย','ฮิปโป','แรด','แพนด้า','จิงโจ้','โคอาลา','นกฮูก','เหยี่ยว','อินทรี',
    'ปลาหมึก','แมงกะพรุน','กุ้ง','ปู','หอย','แมงมุม','มด','ผึ้ง','ผีเสื้อ','ตั๊กแตน',
    'นกแก้ว','นกกระจอก','อีกา','หงส์','เพนกวิน','อูฐ','ลามะ','อัลปาก้า'
  ],
  '🍜 อาหาร': [
    'ข้าวผัด','ส้มตำ','ผัดไทย','กะเพรา','ข้าวมันไก่','ต้มยำ','แกงเขียวหวาน','แกงส้ม','แกงเผ็ด',
    'ข้าวขาหมู','ข้าวหมูแดง','ข้าวไข่เจียว','ข้าวคลุกกะปิ','ข้าวต้ม','บะหมี่','สุกี้','ราเมง','ซูชิ',
    'พิซซ่า','แฮมเบอร์เกอร์','สปาเกตตี','สเต๊ก','ทาโก้','เคบับ','ลาซานญ่า','ซุป','ข้าวหน้าเนื้อ',
    'ข้าวหน้าไก่','ข้าวแกง','ข้าวเหนียวหมูปิ้ง','ก๋วยเตี๋ยว','หมูกระทะ','ชาบู'
  ],
  '🍰 ของหวาน': [
    'ไอศกรีม','เค้ก','บราวนี่','คุกกี้','โดนัท','วาฟเฟิล','แพนเค้ก','บิงซู','ช็อกโกแลต',
    'พุดดิ้ง','เยลลี่','ทาร์ต','ชีสเค้ก','มาการอง','เครป','ลอดช่อง','บัวลอย','ขนมชั้น',
    'ข้าวเหนียวมะม่วง','น้ำแข็งไส','โรตี','กล้วยทอด','ทองหยิบ','ทองหยอด','ฝอยทอง'
  ],
 '🍉 ผลไม้': [
    'แอปเปิ้ล','กล้วย','ส้ม','มะม่วง','แตงโม','สับปะรด','องุ่น','เชอร์รี่','สตรอว์เบอร์รี','บลูเบอร์รี',
    'กีวี','ลูกแพร์','ทับทิม','มะละกอ','ฝรั่ง','ชมพู่','เงาะ','ลิ้นจี่','ลองกอง','ลำไย',
    'มังคุด','ทุเรียน','ขนุน','มะพร้าว','มะขาม','ส้มโอ','มะนาว','อะโวคาโด','เสาวรส','มะเฟือง',
    'ลูกพลับ','อินทผลัม','พีช','พลัม','เนคทารีน','แคนตาลูป','ฮันนี่ดิว','มะเขือเทศ','แครนเบอร์รี',
    'สละ','ระกำ','กะท้อน','มะยม','ลูกไหน','ยูสุ'
  ],
  '👨‍💼 อาชีพ': [
    'หมอ','ครู','นักบิน','ตำรวจ','ทหาร','นักแสดง','นักร้อง','วิศวกร','สถาปนิก','ชาวนา',
    'พ่อครัว','นักกีฬา','นักวิทยาศาสตร์','นักเขียน','ช่างภาพ','ยูทูบเบอร์','สตรีมเมอร์','โปรแกรมเมอร์',
    'นักออกแบบ','กราฟิกดีไซน์','แฮกเกอร์','นักข่าว','ทนาย','ผู้พิพากษา','พนักงานขาย','ช่างไฟ','ช่างยนต์'
  ],
  '📱 สิ่งของ': [
    'รถ','บ้าน','โทรศัพท์','คอมพิวเตอร์','โต๊ะ','เก้าอี้','กระจก','นาฬิกา','แว่นตา','ร่ม',
    'กระเป๋า','รองเท้า','หมวก','ดินสอ','ปากกา','กีตาร์','ลูกโป่ง','ทีวี','พัดลม','เครื่องซักผ้า',
    'ตู้เย็น','ไมโครเวฟ','กล้อง','แท็บเล็ต','เมาส์','คีย์บอร์ด','ลำโพง','หูฟัง','สายชาร์จ'
  ],
  '🌏 ประเทศ': [
    'ไทย','ญี่ปุ่น','เกาหลีใต้','จีน','อินเดีย','ลาว','เวียดนาม','สิงคโปร์','มาเลเซีย','อินโดนีเซีย',
    'ฟิลิปปินส์','ออสเตรเลีย','นิวซีแลนด์','สหรัฐอเมริกา','แคนาดา','เม็กซิโก','บราซิล','อาร์เจนตินา',
    'อังกฤษ','ฝรั่งเศส','เยอรมัน','อิตาลี','สเปน','โปรตุเกส','เนเธอร์แลนด์','เบลเยียม','สวิตเซอร์แลนด์',
    'รัสเซีย','ยูเครน','ตุรกี','ซาอุดีอาระเบีย','อิสราเอล','อียิปต์','แอฟริกาใต้'
  ],
 '⚽ กีฬา': [
    'ฟุตบอล','บาสเกตบอล','วอลเลย์บอล','เทนนิส','แบดมินตัน','มวย','ว่ายน้ำ','ปิงปอง','กอล์ฟ','วิ่ง',
    'รักบี้','คริกเก็ต','เบสบอล','ฮอกกี้','ยิมนาสติก','สเก็ต','สโนว์บอร์ด','ปีนเขา'
  ],
 '🎮 เกม': [
    'Minecraft','Roblox','Free Fire','PUBG','Valorant','GTA','Among Us','The Sims','Call of Duty',
    'Fortnite','Apex Legends','Dota 2','League of Legends','FIFA','eFootball','Resident Evil'
  ],
'🎬 หนัง/การ์ตูน': [
    'นารูโตะ','วันพีซ','ดราก้อนบอล','โดราเอมอน','Attack on Titan','Demon Slayer','Jujutsu Kaisen',
    'Tokyo Revengers','Avengers','Spider-Man','Batman','Frozen','Toy Story','Cars'
  ],
 '🏫 สถานที่': [
    'โรงเรียน','โรงพยาบาล','ห้าง','สนามบิน','ชายหาด','ภูเขา','วัด','สวนสัตว์','ตลาด','คาเฟ่',
    'โรงหนัง','สนามกีฬา','สวนสาธารณะ','พิพิธภัณฑ์','ห้องสมุด','โรงแรม','รีสอร์ต'
  ],
  '📚 วิชาในโรงเรียน': [
    'คณิตศาสตร์','ภาษาไทย','ภาษาอังกฤษ','วิทยาศาสตร์','สังคมศึกษา',
    'ฟิสิกส์','เคมี','ชีววิทยา','ประวัติศาสตร์','ภูมิศาสตร์',
    'คอมพิวเตอร์','เขียนโปรแกรม','ศิลปะ','ดนตรี','พละ','สุขศึกษา'
  ]
};

const CATS = Object.keys(WORDS);

/* ══════ HELPERS ══════ */
const rooms = {};
const shuffle = arr => [...arr].sort(() => Math.random() - .5);
const rankScore = r => [100, 75, 50][r] ?? 25;

function broadcastRoom(code) {
  const room = rooms[code]; if (!room) return;
  Object.values(room.players).forEach(p =>
    io.to(p.id).emit('updateRoom', buildView(room, p.id))
  );
}

function buildView(room, pid) {
  const c = JSON.parse(JSON.stringify(room));
  delete c.masterWords;
  if (c.players[pid]) c.players[pid].word = null;
  return c;
}

function activePlayers(room) {
  return room.turnOrder.filter(id => room.players[id] && !room.players[id].out && !room.players[id].won);
}

function advanceTurn(room) {
  const alive = activePlayers(room);
  if (!alive.length) return null;
  const idx = alive.indexOf(room.currentTurn);
  return alive[(idx + 1) % alive.length];
}

/* ══════ SOCKET ══════ */
io.on('connection', socket => {
  console.log('+ connect', socket.id);

  /* สร้างห้อง */
  socket.on('createRoom', ({ name, avatar, maxPlayers, maxWrong }) => {
    const code = String(Math.floor(10000 + Math.random() * 90000));
    rooms[code] = {
      code, host: socket.id, phase: 'waiting',
      category: CATS[0],
      maxPlayers: Math.min(10, Math.max(2, +maxPlayers || 8)),
      maxWrong:   Math.min(10, Math.max(1, +maxWrong   || 3)),
      players: { [socket.id]: mkPlayer(socket.id, name, avatar) },
      masterWords: {}, winOrder: [], turnOrder: [], currentTurn: null,
      chatMessages: [],
    };
    socket.join(code);
    socket.data.roomCode = code;
    socket.emit('roomCreated', { code, view: buildView(rooms[code], socket.id) });
  });

  /* เข้าห้อง */
  socket.on('joinRoom', ({ code, name, avatar }) => {
    const room = rooms[code];
    if (!room)                                            return socket.emit('gameError', 'ไม่พบห้องนี้!');
    if (room.phase !== 'waiting')                         return socket.emit('gameError', 'เกมเริ่มแล้ว!');
    if (Object.keys(room.players).length >= room.maxPlayers) return socket.emit('gameError', 'ห้องเต็มแล้ว!');

    room.players[socket.id] = mkPlayer(socket.id, name, avatar);
    socket.join(code); socket.data.roomCode = code;
    broadcastRoom(code);
    socket.emit('joinedRoom', { code });
  });

  /* ปรับ settings */
  socket.on('setSettings', ({ code, category, maxPlayers, maxWrong }) => {
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;
    if (category && WORDS[category]) room.category = category;
    if (maxPlayers) room.maxPlayers = Math.min(10, Math.max(2, +maxPlayers));
    if (maxWrong)   room.maxWrong   = Math.min(10, Math.max(1, +maxWrong));
    broadcastRoom(code);
  });

  /* kick ผู้เล่น */
  socket.on('kickPlayer', ({ code, targetId }) => {
    const room = rooms[code];
    if (!room || room.host !== socket.id || targetId === socket.id) return;
    io.to(targetId).emit('kicked');
    delete room.players[targetId];
    broadcastRoom(code);
  });

  /* เริ่มเกม */
  socket.on('startGame', code => {
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;
    const players = Object.values(room.players);
    if (players.length < 2) return socket.emit('gameError', 'ต้องมีอย่างน้อย 2 คน!');

    const wl = shuffle(WORDS[room.category] || WORDS[CATS[0]]);
    room.masterWords = {}; room.winOrder = [];
    room.turnOrder = shuffle(players.map(p => p.id));
    room.currentTurn = room.turnOrder[0];

    players.forEach((p, i) => {
      p.word = wl[i % wl.length];
      p.wrong = 0; p.out = false; p.won = false; p.rank = null; p.score = 0;
      room.masterWords[p.id] = p.word;
    });
    room.phase = 'playing';
    broadcastRoom(code);
    io.to(code).emit('toast', { msg: `🎲 เริ่ม! รอบแรก: ${room.players[room.currentTurn]?.name}`, type: 'i' });
  });

  /* ตอบคำ */
  socket.on('answer', ({ code, answer }) => {
    const room = rooms[code];
    if (!room || room.phase !== 'playing') return;
    if (room.currentTurn !== socket.id) return socket.emit('gameError', 'ยังไม่ถึงรอบคุณ!');
    const p = room.players[socket.id];
    if (!p || p.out || p.won) return;

    if (answer.trim() === room.masterWords[socket.id]) {
      const rank = room.winOrder.length;
      room.winOrder.push(socket.id);
      p.rank = rank; p.score = rankScore(rank);
      p.totalScore = (p.totalScore || 0) + p.score;
      p.won = true; p.out = true;
      io.to(code).emit('toast', { msg: `${'🥇🥈🥉'.split('')[rank] ?? '🎖️'} ${p.name} ตอบถูก! +${p.score}pt`, type: 's' });
    } else {
      p.wrong++;
      if (p.wrong >= room.maxWrong) {
        p.out = true;
        io.to(code).emit('toast', { msg: `💀 ${p.name} หมดสิทธิ์!`, type: 'e' });
      } else {
        socket.emit('toast', { msg: `❌ ผิด! (${p.wrong}/${room.maxWrong})`, type: 'e' });
      }
    }

    if (Object.values(room.players).every(pl => pl.out || pl.won)) {
      endGame(room, code); return;
    }
    room.currentTurn = advanceTurn(room);
    broadcastRoom(code);
    if (room.currentTurn) io.to(code).emit('toast', { msg: `➡️ ถึงรอบ ${room.players[room.currentTurn]?.name}`, type: 'i' });
  });

  /* ข้าม */
  socket.on('skip', code => {
    const room = rooms[code];
    if (!room || room.phase !== 'playing' || room.currentTurn !== socket.id) return;
    room.currentTurn = advanceTurn(room);
    broadcastRoom(code);
    if (room.currentTurn) io.to(code).emit('toast', { msg: `⏭️ ถึงรอบ ${room.players[room.currentTurn]?.name}`, type: 'i' });
  });

  /* แชท */
  socket.on('chat', ({ code, text }) => {
    const room = rooms[code];
    if (!room || !room.players[socket.id]) return;
    const msg = {
      id: Date.now(), from: socket.id,
      name: room.players[socket.id].name,
      avatar: room.players[socket.id].avatar,
      text: String(text).slice(0, 120),
    };
    room.chatMessages.push(msg);
    if (room.chatMessages.length > 200) room.chatMessages.shift();
    io.to(code).emit('chatMsg', msg);
  });

  /* เล่นอีกรอบ */
  socket.on('playAgain', code => {
    const room = rooms[code];
    if (!room || room.host !== socket.id) return;
    Object.values(room.players).forEach(p => {
      p.word = null; p.wrong = 0; p.out = false; p.won = false; p.rank = null; p.score = 0;
    });
    room.masterWords = {}; room.winOrder = []; room.turnOrder = []; room.currentTurn = null;
    room.phase = 'waiting';
    broadcastRoom(code);
  });

  /* disconnect */
  socket.on('disconnect', () => {
    const code = socket.data.roomCode;
    const room = rooms[code]; if (!room) return;
    delete room.players[socket.id];
    delete room.masterWords[socket.id];
    room.turnOrder = room.turnOrder.filter(id => id !== socket.id);

    const remaining = Object.keys(room.players);
    if (!remaining.length) { delete rooms[code]; return; }
    if (room.host === socket.id) room.host = remaining[0];
    if (room.currentTurn === socket.id) room.currentTurn = advanceTurn(room);

    if (room.phase === 'playing' && Object.values(room.players).every(p => p.out || p.won)) {
      endGame(room, code); return;
    }
    broadcastRoom(code);
  });
});

/* ══════ GAME END ══════ */
function endGame(room, code) {
  room.phase = 'result';
  const rv = JSON.parse(JSON.stringify(room));
  delete rv.masterWords;
  Object.entries(room.masterWords || {}).forEach(([pid, w]) => {
    if (rv.players[pid]) rv.players[pid].word = w;
  });
  io.to(code).emit('updateRoom', rv);
}

function mkPlayer(id, name, avatar) {
  return { id, name, avatar: avatar||null, word:null, wrong:0, out:false, won:false, totalScore:0, rank:null, score:0 };
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`\n🎭 คำบนหัว → http://localhost:${PORT}\n`));
