const screens = [...document.querySelectorAll('.screen')];
const progressBar = document.getElementById('progressBar');
const envelope = document.getElementById('envelope');
const beginBtn = document.getElementById('beginBtn');
const reasonMessage = document.getElementById('reasonMessage');
const letterText = document.getElementById('letterText');
const heartButton = document.getElementById('heartButton');
const toast = document.getElementById('toast');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const musicGate = document.getElementById('musicGate');
const openSurpriseBtn = document.getElementById('openSurpriseBtn');

const galleryPhotos = [
  { src: 'photos/photo1.jpg', label: 'OUR MEMORY', caption: 'One of my favorite days', alt: 'A favorite memory together' },
  { src: 'photos/photo2.jpg', label: 'JUST US', caption: 'That smile. Always that smile.', alt: 'A sweet memory' },
  { src: 'photos/photo_2026-10-28_15-26-59.jpg', label: 'A LITTLE MEMORY', caption: 'A moment worth holding close', alt: 'A cherished memory' },
  { src: 'photos/photo_2026-10-28_15-27-07.jpg', label: 'A FAVORITE MOMENT', caption: 'One more reason to smile', alt: 'A favorite moment' },
  { src: 'photos/photo_2026-10-28_15-28-21.jpg', label: 'A BEAUTIFUL SMILE', caption: 'A smile I love to remember', alt: 'A beautiful smiling memory' },
  { src: 'photos/photo_2026-10-28_15-28-35.jpg', label: 'JUST US', caption: 'The warmth of a little moment', alt: 'A warm memory together' },
  { src: 'photos/photo_2026-10-28_17-04-42.jpg', label: 'MY PERSON', caption: 'One more memory to hold close', alt: 'A close-up memory' },
  { src: 'photos/photo_2026-10-28_17-04-48.jpg', label: 'A LITTLE LAUGHTER', caption: 'A moment that makes me smile', alt: 'A laughing memory' },
  { src: 'photos/photo_2026-10-28_17-05-10.jpg', label: 'A SOFT MOMENT', caption: 'One of our quiet, cozy moments', alt: 'A cozy memory together' },
  { src: 'photos/awdaw.jpg', label: 'OUR LITTLE STORY', caption: 'A little piece of us', alt: 'A memory from our little story' }
];

const galleryPhotoA = document.getElementById('galleryPhotoA');
const galleryPhotoB = document.getElementById('galleryPhotoB');
const galleryCaption = document.getElementById('galleryCaption');
const galleryCaptionLabel = document.getElementById('galleryCaptionLabel');
const galleryCaptionText = document.getElementById('galleryCaptionText');
const galleryGlow = document.getElementById('galleryGlow');
const galleryDots = document.getElementById('galleryDots');
let galleryIndex = 0;
let galleryShowingA = true;
let galleryTimer = null;
let galleryTransitioning = false;

galleryPhotos.forEach((photo, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = `gallery-dot${index === 0 ? ' is-active' : ''}`;
  dot.setAttribute('aria-label', `Show photo ${index + 1}`);
  dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
  dot.addEventListener('click', () => showGalleryPhoto(index, true));
  galleryDots.appendChild(dot);
});

function stopGallery() {
  clearInterval(galleryTimer);
  galleryTimer = null;
}

function scheduleGallery() {
  stopGallery();
  if (currentScreen !== 1 || document.hidden) return;
  galleryTimer = setInterval(() => showGalleryPhoto(galleryIndex + 1, false), 5200);
}

function showGalleryPhoto(nextIndex, resetTimer) {
  if (galleryTransitioning) return;
  const normalizedIndex = (nextIndex + galleryPhotos.length) % galleryPhotos.length;
  if (normalizedIndex === galleryIndex && galleryTimer) {
    if (resetTimer) scheduleGallery();
    return;
  }

  const photo = galleryPhotos[normalizedIndex];
  const outgoing = galleryShowingA ? galleryPhotoA : galleryPhotoB;
  galleryTransitioning = true;
  const incoming = galleryShowingA ? galleryPhotoB : galleryPhotoA;
  const motionClass = normalizedIndex % 3 === 1 ? 'motion-b' : normalizedIndex % 3 === 2 ? 'motion-c' : '';

  incoming.className = `gallery-photo ${galleryShowingA ? 'gallery-photo-b' : 'gallery-photo-a'} ${motionClass}`.trim();
  incoming.alt = photo.alt;
  incoming.setAttribute('aria-hidden', 'true');
  incoming.onload = () => {
    outgoing.classList.remove('is-active');
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');
    setTimeout(() => { galleryTransitioning = false; }, 850);
  };
  incoming.src = photo.src;
  galleryGlow.style.backgroundImage = `url("${photo.src}")`;
  galleryCaption.classList.add('is-changing');

  setTimeout(() => {
    galleryCaptionLabel.textContent = photo.label;
    galleryCaptionText.textContent = photo.caption;
    galleryCaption.classList.remove('is-changing');
  }, 220);

  [...galleryDots.children].forEach((dot, index) => {
    dot.classList.toggle('is-active', index === normalizedIndex);
    dot.setAttribute('aria-current', index === normalizedIndex ? 'true' : 'false');
  });

  galleryIndex = normalizedIndex;
  galleryShowingA = !galleryShowingA;
  const nextPhoto = galleryPhotos[(normalizedIndex + 1) % galleryPhotos.length];
  const preload = new Image();
  preload.src = nextPhoto.src;
  if (resetTimer || currentScreen === 1) scheduleGallery();
}

document.getElementById('galleryPrevious').addEventListener('click', () => showGalleryPhoto(galleryIndex - 1, true));
document.getElementById('galleryNext').addEventListener('click', () => showGalleryPhoto(galleryIndex + 1, true));
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopGallery();
  else scheduleGallery();
});

let musicPlayPromise = null;

function updateMusicUI(isPlaying) {
  musicLabel.textContent = isPlaying ? 'Playing' : 'Our song';
  musicToggle.classList.toggle('playing', isPlaying);
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
}

function showMusicGate() {
  musicGate.hidden = false;
  document.body.classList.add('music-gate-open');
  openSurpriseBtn.focus();
}

function hideMusicGate() {
  musicGate.hidden = true;
  document.body.classList.remove('music-gate-open');
}

async function startMusic(showFallback = false) {
  const source = bgMusic.querySelector('source');
  if (!source || !source.getAttribute('src')) {
    if (showFallback) showMusicGate();
    return false;
  }
  if (!bgMusic.paused) {
    updateMusicUI(true);
    return true;
  }
  if (musicPlayPromise) {
    const wasStarted = await musicPlayPromise;
    if (wasStarted) return true;
  }

  bgMusic.volume = 0.55;
  musicPlayPromise = bgMusic.play()
    .then(() => {
      updateMusicUI(true);
      hideMusicGate();
      return true;
    })
    .catch(() => {
      updateMusicUI(false);
      if (showFallback) showMusicGate();
      return false;
    })
    .finally(() => {
      musicPlayPromise = null;
    });
  return musicPlayPromise;
}

function openSurprise() {
  hideMusicGate();
  openEnvelope();
  void startMusic(false);
}

bgMusic.addEventListener('play', () => updateMusicUI(true));
bgMusic.addEventListener('pause', () => updateMusicUI(false));
bgMusic.addEventListener('ended', () => updateMusicUI(false));
bgMusic.addEventListener('error', () => {
  updateMusicUI(false);
  showToast('The song could not be loaded, but your letter is still here.');
});
openSurpriseBtn.addEventListener('click', openSurprise);


const nickname = 'Hon'; // Change this to "Elai" or "Lai" if you prefer.
document.getElementById('heroNickname').textContent = nickname;
document.getElementById('letterNickname').textContent = 'Lai';

let currentScreen = 0;
let letterStarted = false;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function goToScreen(id) {
  const next = screens.findIndex(screen => screen.id === id);
  if (next < 0) return;
  screens.forEach((screen, index) => {
    screen.classList.toggle('active', index === next);
    screen.setAttribute('aria-hidden', index === next ? 'false' : 'true');
  });
  currentScreen = next;
  progressBar.style.width = `${(next / (screens.length - 1)) * 100}%`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'memories') scheduleGallery();
  else stopGallery();
  if (id === 'letter' && !letterStarted) startLetter();
  if (id === 'finale') burstHearts(16);
}

function openEnvelope() {
  envelope.classList.add('opened');
  setTimeout(() => goToScreen('memories'), 780);
}
envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openEnvelope();
  }
});
beginBtn.addEventListener('click', openEnvelope);

document.querySelectorAll('.next-btn').forEach(button => {
  button.addEventListener('click', () => goToScreen(button.dataset.next));
});

document.querySelectorAll('.reason-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.reason-card').forEach(other => other.classList.remove('opened'));
    card.classList.add('opened');
    reasonMessage.textContent = card.dataset.message;
    reasonMessage.animate(
      [{ opacity: .25, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 420, easing: 'ease-out' }
    );
  });
});

const letter = `Alam mo, minsan hindi q alam kung paano ko sisimulan ung mga gusto kong sabihin sayo, kse parang kahit gaano kahaba ung message q, parang kulang pa rin para maipaliwanag kung gaano ka kahalaga sakin. Pero susubukan q pa rin, kse deserve mong malaman ung mga bagay na minsan hindi q masabi nang harapan.

Ang funny lang isipin na four years ago, naging part ka na ng buhay q, tapos ngayon, nandito ulit aq, nanliligaw sayo, trying to win your heart all over again. Hindi q alam kung paano ipapaliwanag ung feeling na binigyan ulit tayo ng pagkakataong makilala ang isa't isa sa ganitong paraan. Pero ang alam q, sobrang thankful aq na nagkaroon ulit aq ng chance na makasama ka, makausap ka, at makita ka ulit nang ganito.

And honestly, hindi lang naman dahil maganda ka. Oo, sobrang ganda mo, lalo na ng eyes mo, pero alam mo kung ano ung pinaka-gusto q? Ung smile mo. Ung ngiti mong lagi q gustong makita. Parang kahit simpleng pagngiti mo lang, may nagbabago na agad sa mood q. Hindi q alam kung paano mo nagagawa un, pero may something talaga sayo na hindi q kayang i-explain nang maayos.

I fell for your personality, for your kindness, and for the way you care for the people around you. Gusto q ung pagiging maharot mo, ung pagiging mapag-biro mo, kse same tayo ng humor at ang saya mong kasama. Hindi q kailangang pilitin ung sarili q na maging ibang tao kapag kausap kita. I can joke with you, laugh with you, and just enjoy the moment with you. And I really love that about us.

Tapos ung pagiging maalalahanin at maalaga mo, ung pagiging mapagbigay mo, and the little things you do without even realizing how much they mean to me. Kapag ngumingiti ka, kinikilig aq. Kapag nag-aalala ka sakin, ramdam q na may taong concerned sa kung kumusta aq. At kahit kapag pinapagalitan mo aq, minsan napapangiti na lang aq, kse kahit papaano, nakikita q ung care mo sa mga simpleng bagay na ginagawa mo.

One of my favorite things about us is ung mga moments na magkasama tayong gumagala, naglalakad habang nagkukuwentuhan, at unti-unting nag-o-open up sa isa't isa. Hindi naman kailangan na sobrang bongga ng ginagawa natin para maging memorable ung moment. Minsan, sapat na ung magkasama tayo, nag-uusap, at nakikilala pa natin ang isa't isa nang mas malalim.

And those calls we often have? I appreciate them more than you know. Kahit simpleng pag-uusap lang, nagiging special ung oras q dahil ikaw ung kausap q. There is something about being able to talk to you that gives me this happiness na hindi q ma-explain. Sobrang saya, pero hindi ung simpleng saya lang. It's the kind of happiness na mapapaisip ka na lang, "Ganito pala kasaya kapag siya ung kasama mo sa moment na 'to."

Lai, thank you for coming back into my life. Thank you for giving me the chance to be here again, to court you, and to show you how much I care about you. Hindi q gustong balewalain kahit isang effort na binibigay mo sakin. I notice them, I appreciate them, and I hope na kahit sa maliliit na paraan, napaparamdam q rin sayo na mahalaga sakin ung bawat effort mo.

And there's something else I want you to know.

I'm proud of you. Sobrang proud aq sayo, especially sa mga panahong alam kong nasa lowest point ka pero patuloy ka pa ring lumalaban. Kahit may mga araw na mahirap para sayo, you still try to keep going and find the strength within yourself. Maybe you don't always see how strong you are, pero sana maalala mo na may isang taong naniniwala sayo at proud na proud sa kung paano mo hinaharap ang buhay.

You don't have to be strong all the time, okay? Hindi mo kailangang itago lahat ng nararamdaman mo or piliting maging okay kapag hindi ka naman talaga okay. You can rest. You can have bad days. You can tell me when something hurts. Hindi q man kayang ayusin lahat ng problema mo, gusto q pa ring maging taong pwede mong lapitan, kausapin, at sandalan kapag napapagod ka na.

Gusto q maramdaman mo na special ka. Na mahal ka. Na mahalaga ka. Hindi lang kapag masaya ka, hindi lang kapag maganda ung araw mo, at hindi lang kapag kaya mong ibigay ung best version ng sarili mo. Gusto q maramdaman mo na worthy kang mahalin kahit sa mga araw na pagod ka, tahimik ka, or hindi mo alam kung paano mo haharapin ung mga bagay na nangyayari sayo.

I want to keep choosing you, not just through words, but through the little things I do. Gusto q samahan ka sa mga araw na masaya ka at sa mga araw na kailangan mo ng taong makikinig sayo. Gusto q hawakan ung kamay mo habang sabay nating hinaharap ung mga bagay na hindi natin kayang kontrolin. At gusto q iparamdam sayo na hindi mo kailangang harapin ang lahat nang mag-isa.

I know na hindi sapat ang magagandang salita para patunayan ang isang pagmamahal. That's why I don't want this letter to be just a collection of promises. Gusto q, habang tumatagal, makita mo sa actions q kung gaano kita pinapahalagahan. Gusto q maging consistent, maging honest, at matutong mahalin ka sa paraang deserve mo. Hindi man aq perfect, I want to keep learning how to love you better.

And this time, I want us to make things more beautiful. More meaningful. More memorable.

Hindi q gustong isipin mo na kailangan nating maging perfect para maging masaya. Ang gusto q, kapag may misunderstandings, matuto tayong makinig. Kapag may problema, subukan nating pag-usapan. Kapag may araw na hindi madali, piliin pa rin nating maging honest sa isa't isa. Gusto q na habang binubuo natin ulit ung connection natin, mas makilala pa natin ang isa't isa at mas maging maingat tayo sa puso ng bawat isa.

Kse kung may isang bagay na natutunan q sa pagkakataong ito, iyon ay hindi lahat ng bagay na bumabalik sa buhay natin ay dapat balewalain. Minsan, may pagkakataon tayong magsimula ulit, hindi para ulitin lang ang dati, kundi para gumawa ng mas magandang kuwento.

And that's what I want with you, Hon.

I want more walks with you. More random conversations. More calls na kahit simpleng kuwento lang, masaya na aq dahil ikaw ang kausap q. More moments na makikita ko ung smile mo, maririnig ko ung tawa mo, at mararamdaman kong mas nakikilala pa natin ang isa't isa. Gusto q ng memories na balang araw, kapag binalikan natin, mapapangiti tayo at masasabi nating, "Ang saya pala ng naging journey natin."

I can't promise na every day will be perfect. Pero ang maipapangako q ay susubukan q palagi. Gusto q samahan ka, suportahan ka, alagaan ka sa abot ng makakaya q, at hawakan ung kamay mo habang binubuo natin ang mga pangarap at memories na gusto nating magkaroon. Gusto q na sa paglipas ng panahon, hindi lang sa salita mo maramdaman ung pagmamahal q, kundi sa kung paano kita tratuhin, pakinggan, intindihin, at pahalagahan.

And if there's one thing I really want you to remember, it's this:

You are important to me, Elai. More than I can properly explain. I'm thankful for your presence, for your efforts, for your smile, for your care, and for the chance to know you again in this new chapter of our lives.

So please, alagaan mo palagi ang sarili mo, ha? Huwag mong kalimutang magpahinga kapag pagod ka na. Huwag mong piliting maging okay kapag kailangan mo munang huminga. Patuloy kang lumaban para sa sarili mo, pero tandaan mo rin na hindi mo kailangang buhatin lahat nang mag-isa.

Stay true to yourself. Maging totoo ka lang palagi, and please, let's always be honest with each other. Gusto q na maging safe tayong magsabi ng nararamdaman natin, kahit minsan mahirap sabihin. I want us to keep choosing honesty, understanding, and care.

And whenever you need someone, nandito lang aq. Hindi q man kayang maging sagot sa lahat ng problema mo, handa aq makinig, umintindi, at samahan ka. Nandito aq, willing sumugal ulit, willing mag-effort ulit, at willing ibigay ung pagmamahal na gusto q sanang mas maramdaman mo ngayon.

Kaya eto na, my Lai.

Ito na ung last na LOVE na ibibigay ko—hindi dahil gusto kong matapos ang pagmamahal q, kundi dahil gusto q na sa pagkakataong ito, ibigay ko na ang buong puso q nang may sincerity, effort, at paninindigan. Gusto q na itong pagmamahal na ito ay maging mas maayos, mas totoo, at mas memorable kaysa sa kung ano man ang naiwan natin noon.

This time, let's make it better. Let's make it more meaningful. Let's create memories that we'll always want to look back on. Let's keep learning about each other, keep laughing at our own jokes, keep having those little moments that mean so much, and keep building something that we can both be proud of.

Thank you for coming back, Hon. Thank you for being you. And thank you for letting me try again.

I hope that as you read this, you feel even a little of the happiness you give me just by being part of my life again.

I love you, Elai. I love your smile, your humor, your caring heart, and all those little things that make you who you are.

And if we are given the chance to keep writing this story together, I want to make every page worth remembering.

This time, let's make it better.

This time, let's make it ours.

Always take care of yourself, my love. And whenever you need me, you know where to find me.

Andito lang aq, Lai. ♡`;

function startLetter() {
  letterStarted = true;
  letterText.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    letterText.textContent = letter.slice(0, i++);
    if (i > letter.length) clearInterval(timer);
  }, 23);
}

heartButton.addEventListener('click', () => {
  heartButton.classList.remove('beating');
  void heartButton.offsetWidth;
  heartButton.classList.add('beating');
  burstHearts(24);
  document.getElementById('heartCaption').textContent = 'a little heart, just for you ♡';
  showToast('Sending you the biggest hug, Lai. ♡');
});

document.getElementById('replayBtn').addEventListener('click', () => {
  envelope.classList.remove('opened');
  letterStarted = false;
  document.querySelectorAll('.reason-card').forEach(card => card.classList.remove('opened'));
  reasonMessage.textContent = 'Choose a card to reveal a little note.';
  document.getElementById('heartCaption').textContent = 'tap the heart';
  goToScreen('welcome');
});

function burstHearts(count = 8) {
  const layer = document.getElementById('floatingHearts');
  const symbols = ['♡', '♥', '✧', '✦'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'float-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 22}px`;
    heart.style.animationDuration = `${3.5 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * .8}s`;
    layer.appendChild(heart);
    setTimeout(() => heart.remove(), 8500);
  }
}
setInterval(() => {
  if (document.visibilityState === 'visible') burstHearts(1);
}, 2100);

musicToggle.addEventListener('click', async () => {
  if (bgMusic.paused) {
    await startMusic(true);
  } else {
    bgMusic.pause();
  }
});

// Browsers decide whether a page can play sound without a gesture.
// If permitted, music begins here and the gate stays hidden.
startMusic(true);

// Give keyboard users a helpful starting focus and avoid announcing hidden sections.
screens.forEach((screen, index) => screen.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'));
