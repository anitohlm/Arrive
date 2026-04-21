// ═══ DATA ═══════════════════════════════════════════

// Emotion icon filename resolver — all 39 emotion icons live as
// `assets/<emo>-icon.svg`. One flat rule; fallback to the Sacred Knot
// if called with an unknown emotion.
function emoIconPath(emo){
  return emo ? 'assets/' + emo + '-icon.svg' : 'assets/logogchain.svg';
}

const EMO = {
  // light
  grateful:    {color:'#c9943a',shadow:'rgba(201,148,58,.3)',bg:'rgba(201,148,58,.07)'},
  alive:       {color:'#c97a2a',shadow:'rgba(201,122,42,.3)',bg:'rgba(201,122,42,.07)'},
  tender:      {color:'#c2627a',shadow:'rgba(194,98,122,.3)',bg:'rgba(194,98,122,.07)'},
  calm:        {color:'#4a7c59',shadow:'rgba(74,124,89,.3)',bg:'rgba(74,124,89,.07)'},
  hopeful:     {color:'#5a9a78',shadow:'rgba(90,154,120,.3)',bg:'rgba(90,154,120,.07)'},
  light:       {color:'#c9a832',shadow:'rgba(201,168,50,.3)',bg:'rgba(201,168,50,.07)'},
  // in between
  numb:        {color:'#8a8a8a',shadow:'rgba(138,138,138,.25)',bg:'rgba(138,138,138,.06)'},
  quiet:       {color:'#7a8a9a',shadow:'rgba(122,138,154,.3)',bg:'rgba(122,138,154,.07)'},
  foggy:       {color:'#8a96a2',shadow:'rgba(138,150,162,.3)',bg:'rgba(138,150,162,.07)'},
  restless:    {color:'#b4823c',shadow:'rgba(180,130,60,.3)',bg:'rgba(180,130,60,.07)'},
  searching:   {color:'#647aa0',shadow:'rgba(100,122,160,.3)',bg:'rgba(100,122,160,.07)'},
  // carrying weight
  hard:        {color:'#4a607a',shadow:'rgba(74,96,122,.3)',bg:'rgba(74,96,122,.07)'},
  heavy:       {color:'#6b5a7a',shadow:'rgba(107,90,122,.3)',bg:'rgba(107,90,122,.07)'},
  overwhelmed: {color:'#3a5a7a',shadow:'rgba(58,90,122,.3)',bg:'rgba(58,90,122,.07)'},
  sad:         {color:'#506e96',shadow:'rgba(80,110,150,.3)',bg:'rgba(80,110,150,.07)'},
  frustrated:  {color:'#b4503c',shadow:'rgba(180,80,60,.3)',bg:'rgba(180,80,60,.07)'},
  anxious:     {color:'#a078aa',shadow:'rgba(160,120,170,.3)',bg:'rgba(160,120,170,.07)'},
  // hard to name
  heartbroken: {color:'#aa4650',shadow:'rgba(170,70,80,.3)',bg:'rgba(170,70,80,.07)'},
  disappointed:{color:'#8c7864',shadow:'rgba(140,120,100,.3)',bg:'rgba(140,120,100,.07)'},
  exhausted:   {color:'#786e82',shadow:'rgba(120,110,130,.3)',bg:'rgba(120,110,130,.07)'},
  moved:       {color:'#b46482',shadow:'rgba(180,100,130,.3)',bg:'rgba(180,100,130,.07)'},
  // light (added)
  passionate:  {color:'#d94a4a',shadow:'rgba(217,74,74,.35)',bg:'rgba(217,74,74,.08)'},
  content:     {color:'#a0b888',shadow:'rgba(160,184,136,.3)',bg:'rgba(160,184,136,.07)'},
  relaxed:     {color:'#9ec8a0',shadow:'rgba(158,200,160,.3)',bg:'rgba(158,200,160,.07)'},
  focused:     {color:'#5880a0',shadow:'rgba(88,128,160,.3)',bg:'rgba(88,128,160,.07)'},
  inspired:    {color:'#e09848',shadow:'rgba(224,152,72,.35)',bg:'rgba(224,152,72,.08)'},
  certain:     {color:'#a08860',shadow:'rgba(160,136,96,.3)',bg:'rgba(160,136,96,.07)'},
  // in between (added)
  nervous:     {color:'#b89a5a',shadow:'rgba(184,154,90,.3)',bg:'rgba(184,154,90,.07)'},
  lost:        {color:'#7a7e88',shadow:'rgba(122,126,136,.25)',bg:'rgba(122,126,136,.06)'},
  yearning:    {color:'#987ba6',shadow:'rgba(152,123,166,.3)',bg:'rgba(152,123,166,.07)'},
  bored:       {color:'#8e8878',shadow:'rgba(142,136,120,.25)',bg:'rgba(142,136,120,.06)'},
  // carrying weight (added)
  livid:       {color:'#a83832',shadow:'rgba(168,56,50,.4)',bg:'rgba(168,56,50,.09)'},
  lonely:      {color:'#5a6888',shadow:'rgba(90,104,136,.3)',bg:'rgba(90,104,136,.07)'},
  upset:       {color:'#b07040',shadow:'rgba(176,112,64,.3)',bg:'rgba(176,112,64,.07)'},
  insecure:    {color:'#a08a90',shadow:'rgba(160,138,144,.3)',bg:'rgba(160,138,144,.07)'},
  // hard to name (added)
  ashamed:     {color:'#7a4a5a',shadow:'rgba(122,74,90,.3)',bg:'rgba(122,74,90,.07)'},
  vulnerable:  {color:'#dba4b2',shadow:'rgba(219,164,178,.3)',bg:'rgba(219,164,178,.07)'},
  betrayed:    {color:'#8a3840',shadow:'rgba(138,56,64,.35)',bg:'rgba(138,56,64,.08)'},
};
const BREATHING_EMOTIONS = new Set([
  'anxious','overwhelmed','heavy','frustrated',
  'heartbroken','restless','hard','foggy','exhausted',
  'nervous','livid','lonely','ashamed',
  'lost','vulnerable','betrayed','insecure','upset','yearning'
]);

const LIGHT_EMOTIONS = new Set([
  'grateful','alive','tender','calm','hopeful','light','passionate',
  'certain','content','focused','inspired','relaxed'
]);

const MEMORY_HEAVY_PHRASES = [
  "you've felt this before",
  "this feeling has visited you before",
  "you've carried this weight before",
  "you've been here before",
  "this isn't the first time you've sat with this",
  "you know this feeling \u2014 it has passed before",
  "you've survived this feeling before",
  "you've met this before and kept going",
  "this has come before, and you stayed",
  "you've held this before"
];

const MEMORY_LIGHT_LABELS = [
  "you\u2019ve been {emo} before. you wrote:",
  "you\u2019ve felt {emo} before. you left this:",
  "you\u2019ve been here, feeling {emo}. you wrote:",
  "you\u2019ve arrived {emo} before. you wrote this:",
  "you know {emo}. the last time, you wrote:",
  "you\u2019ve carried {emo} before. you wrote:",
  "you\u2019ve sat with {emo} before. you left this:",
  "you\u2019ve felt this. on a {emo} day, you wrote:",
  "you\u2019ve been {emo}. you left this here:",
  "you\u2019ve met {emo} before. you wrote:"
];
const INSIGHTS = {
  calm:'Calm is not the absence of feeling. It is the presence of something steady underneath. You arrived today with ground beneath your feet \u2014 that is not nothing. Let\u2019s begin from here.',
  tender:'Tender means you are open. Something in you is soft today \u2014 willing to feel, willing to notice. That openness is a kind of courage most people mistake for weakness. It is not.',
  grateful:'You arrive already full. Not everyone does. Gratitude at the door means you\u2019ve already found something worth holding \u2014 before the day has even asked anything of you.',
  hard:'Hard days don\u2019t disqualify you from this practice. They are the reason for it. Something is heavy today. We won\u2019t pretend otherwise. But you came anyway \u2014 and that means something.',
  heavy:'Heavy is honest. You are carrying something real. This practice doesn\u2019t ask you to put it down \u2014 only to notice, for a moment, what else is also true alongside the weight.',
  overwhelmed:'When everything feels too much, the smallest thing becomes enough. One breath. One word. One morning. We are only ever doing one of these at a time. Start here.',
  alive:'Something is lit in you today. Don\u2019t waste it on small things. Aliveness is rare and worth paying attention to \u2014 let\u2019s find what it\u2019s pointing toward.',
  numb:'Numbness is not the opposite of feeling. It is often feeling\u2019s way of protecting itself. You don\u2019t have to force anything today. Just arrive. That is enough.',
  hopeful:'Hope is not naivety. It is choosing to believe something good is still possible \u2014 even before you have proof. You arrived today leaning forward. That is the whole posture.',
  light:'Unburdened days are rarer than we think. Something in you is free today \u2014 not weighed down, not bracing. Notice it. It will not always be here. But it is here now.',
  quiet:'Not every day arrives with feeling. Sometimes you are simply present \u2014 not high, not low, just here. Presence like that still counts. Let\u2019s begin from the quiet.',
  foggy:'Fog is not the absence of everything. It is the presence of something not yet clear. You don\u2019t have to see the whole path today. One step in the fog still counts.',
  restless:'Restlessness means something in you is looking for its place. You haven\u2019t settled \u2014 and that\u2019s not failure. It\u2019s aliveness that hasn\u2019t found its shape yet.',
  searching:'To be searching means you haven\u2019t given up. Something in you still believes there is something worth finding. Let\u2019s see if we can name what you\u2019re looking for.',
  sad:'Sadness is love with nowhere to go. Something matters enough to hurt. That\u2019s not weakness \u2014 that\u2019s the cost of caring. We\u2019ll sit with it, not rush past it.',
  frustrated:'Frustration is proof you care. You wouldn\u2019t be blocked if it didn\u2019t matter. Something in you knows how it should be \u2014 and today it isn\u2019t. That clarity is worth something.',
  anxious:'Anxiety is the mind protecting you from something it thinks is dangerous. Today we\u2019re not going to argue with it. We\u2019re going to find one small thing that is safe, and begin there.',
  heartbroken:'Something that matters is hurting. Heartbreak is one of the most honest feelings there is \u2014 it means something was real. We won\u2019t ask you to be okay. Just present.',
  disappointed:'Disappointment is the gap between what you hoped and what arrived. You expected something \u2014 that means you wanted something. That wanting is worth honoring, even now.',
  exhausted:'Bone tired tells the truth. Your body and mind are naming something real. We won\u2019t ask much today. Just one word. Just one small thing. That is enough.',
  moved:'To be moved is a gift. Something cracked you open today \u2014 made you feel the full weight of being alive. Don\u2019t rush past it. Let\u2019s name what touched you.',
  passionate:'Passion is aliveness pointed at something. You care enough to burn for it. That is rare \u2014 most people numb out before they get here. Let\u2019s honor what set you alight.',
  nervous:'Nervousness is your body getting ready for something that matters. It is not a warning \u2014 it is attention. You care about what is coming. That caring is worth naming.',
  livid:'Livid is honest. Something crossed a line that matters to you. This practice doesn\u2019t ask you to forgive or soften \u2014 only to notice what the anger is protecting.',
  lonely:'Loneliness is the body asking for company. It is not weakness \u2014 it is one of the oldest, truest signals. You came here today. That is a kind of reaching toward something.',
  ashamed:'Shame makes people hide. You came here instead. That is not small. Something in you believed you were still worth showing up for \u2014 even if quietly. Start from there.',
  certain:'Certainty is rare. Something in you is clear today \u2014 you know what you know. That clarity is a resource. Don\u2019t waste it on old doubts. Use it on what matters now.',
  content:'Content is the hardest state to arrive at and the easiest to miss. Enough is here \u2014 not more, not less. That is the whole practice in one word. Let it be enough.',
  focused:'Focus is attention, kept on purpose. You haven\u2019t let today scatter you yet. That is a small but real act of agency. Let\u2019s use the aim before it drifts.',
  inspired:'Inspiration is the gap closing between what you sense and what you can do. Something just became possible. Don\u2019t let the feeling pass before you name what it pointed at.',
  lost:'Lost is not the opposite of being somewhere \u2014 it is just being somewhere you don\u2019t have a map for. You arrived without one. Walking without a map takes real courage.',
  relaxed:'Relaxed is what the body does when it stops defending. Today something in you is not bracing. Notice it. It will not always be here. Let\u2019s be with it while it is.',
  vulnerable:'Vulnerability is letting yourself be seen before you are ready. Something in you is open today. We won\u2019t ask you to be brave about it \u2014 only to notice the opening.',
  yearning:'Yearning is love with its arms extended. You want something \u2014 and wanting is not a failure. It\u2019s the shape of being alive toward something. Let\u2019s name what.',
  betrayed:'Betrayal is what happens when trust breaks in a way that matters. You are right to be hurt. This practice doesn\u2019t ask you to forgive anyone \u2014 only to name the break.',
  bored:'Boredom is underrated. It is often where your mind goes looking for what hasn\u2019t been nourished. Something in you is asking to be fed. Let\u2019s see what.',
  insecure:'Insecurity says \u201cwho are you to\u2026\u201d You came anyway. That is the whole point of a practice \u2014 showing up before you feel qualified to. You\u2019re already doing it.',
  upset:'Upset is the body\u2019s way of saying something matters and something is wrong. Don\u2019t rush past it. Let\u2019s find out what it\u2019s pointing at.',
};
const PROMPTS = {
  calm:'In the stillness of today, what small thing revealed itself to you \u2014 something you might have missed if you\u2019d been moving faster?',
  tender:'What person, moment, or memory today made something soften in you \u2014 even slightly?',
  grateful:'You arrived already grateful. What is the one thing that most deserves to be named today?',
  hard:'today is heavy \u2014 i know. you don\u2019t have to make sense of it. just name one small thing that was still here.',
  heavy:'you\u2019re carrying something real. we won\u2019t put it down yet. but tell me \u2014 what else is also here, even quietly?',
  overwhelmed:'too much today. i hear you. just one thing \u2014 one small mercy, however tiny \u2014 let\u2019s start there.',
  alive:'Something in you is lit today. What do you want to do with that fire?',
  numb:'you don\u2019t have to feel anything. you\u2019re allowed to just be here. what is one thing you noticed, even if flat?',
  hopeful:'What is the hope you are carrying today \u2014 even if it\u2019s small, even if it\u2019s fragile?',
  light:'What does it feel like to be unburdened today? What has lifted, even slightly?',
  quiet:'a quiet day is still a day. no need to make it loud. what\u2019s simply here with you?',
  foggy:'fog is okay. you don\u2019t need the whole path. what\u2019s one thing close enough to touch?',
  restless:'something in you is looking for somewhere to land. you don\u2019t have to find it yet \u2014 just name what it\u2019s reaching toward.',
  searching:'you\u2019re still looking. that means you still believe something is there. what are you hoping to find?',
  sad:'sadness is love that misses something. you don\u2019t have to fix it. just name what you love.',
  frustrated:'you wouldn\u2019t be this blocked if it didn\u2019t matter. what is the caring underneath?',
  anxious:'your body is trying to keep you safe. we don\u2019t have to argue with it. tell me one small thing today that felt okay.',
  heartbroken:'something that matters is hurting. you don\u2019t have to be okay. what small thing is still here with you?',
  disappointed:'you hoped for something and it didn\u2019t come. that wanting was real. say what it was.',
  exhausted:'bone tired. i hear you. we\u2019ll ask very little today. just one small thing \u2014 whatever you can give.',
  moved:'What moved you today? Name the thing that cracked something open.',
  passionate:'What set you alight today? What do you care about enough to burn for?',
  nervous:'your body is tuned up because something matters. what is it? say what\u2019s coming.',
  livid:'something crossed a line today \u2014 and you\u2019re right to feel it. tell me what the anger is protecting.',
  lonely:'you\u2019re missing a specific kind of company. name it. this chain is here while you wait.',
  ashamed:'shame wants you to hide. you showed up anyway. what would you say if shame wasn\u2019t in the room?',
  certain:'What do you know today, without needing to explain it?',
  content:'What is enough about today \u2014 exactly as it is?',
  focused:'Where is your attention pointed today? What is it serving?',
  inspired:'What sparked today? What does the spark want you to do with it?',
  lost:'you don\u2019t have a map. that\u2019s alright. what\u2019s one thing that is still true while you walk?',
  relaxed:'What let you unbrace today? What feels easy that usually doesn\u2019t?',
  vulnerable:'you\u2019re soft today \u2014 that takes nerve. what are you willing to let yourself feel, even a little?',
  yearning:'you want something. that\u2019s honest. say it plainly \u2014 it\u2019s safe to say it here.',
  betrayed:'something broke that shouldn\u2019t have. you don\u2019t have to forgive it yet. just name what happened.',
  bored:'even flat days count. what\u2019s one small thing that still has a pulse?',
  insecure:'you doubted yourself and came anyway. what do you want to say \u2014 if shame wasn\u2019t listening?',
  upset:'something is wrong and your body knows it. let\u2019s find out what \u2014 no rush, just name it.',
};
const PLACEHOLDERS = {
  calm:'I notice\u2026',tender:'I felt something soft when\u2026',grateful:'Today I am most grateful for\u2026',
  hard:'Even today, there was\u2026',heavy:'Underneath the weight, I notice\u2026',
  overwhelmed:'One small mercy today was\u2026',alive:'I want to remember\u2026',numb:'Something here, quietly\u2026',
  hopeful:'I am hoping for\u2026',light:'Today feels lighter because\u2026',quiet:'In the quiet, I notice\u2026',
  foggy:'Even in the fog, I can see\u2026',restless:'Something in me is looking for\u2026',searching:'I am searching for\u2026',
  sad:'What I love enough to miss\u2026',frustrated:'I care enough about this to be frustrated by\u2026',
  anxious:'One small safe thing today was\u2026',heartbroken:'What is still true\u2026',
  disappointed:'I had hoped\u2026',exhausted:'One small mercy today\u2026',moved:'What moved me was\u2026',
  passionate:'What set me alight today\u2026',nervous:'I\u2019m nervous about\u2026',
  livid:'What crossed the line\u2026',lonely:'The company I miss\u2026',ashamed:'What I\u2019d say if shame weren\u2019t listening\u2026',
  certain:'What I\u2019m clear about today\u2026',content:'Enough today looks like\u2026',
  focused:'Where my attention is pointing\u2026',inspired:'What sparked\u2026',
  lost:'Without a compass, I still notice\u2026',relaxed:'The ease today is\u2026',
  vulnerable:'What I\u2019m willing to show today\u2026',yearning:'What I\u2019m reaching for\u2026',
  betrayed:'The break I\u2019m naming\u2026',bored:'In the flatness, I notice\u2026',
  insecure:'Even shaky, what\u2019s true\u2026',upset:'What\u2019s disturbing me\u2026',
};
const ARRIVAL_HINTS = {

  // ── calm ──
  'calm|clarity':   'A still morning. Let\u2019s find what deserves your attention.',
  'calm|peace':     'You arrive quietly. Let\u2019s keep it that way.',
  'calm|gratitude': 'Calm and grateful. That\u2019s a rare combination. Let\u2019s honor it.',
  'calm|courage':   'Staying soft in a loud world takes courage. You don\u2019t have to be loud today.',

  // ── tender ──
  'tender|clarity':   'Something soft in you is paying attention. Trust it.',
  'tender|peace':     'Tenderness needs no armor. We\u2019ll go gently.',
  'tender|gratitude': 'To feel tender is to feel gratitude\u2019s cousin. Let\u2019s name what opened you.',
  'tender|courage':   'Being tender takes courage. You already have it.',

  // ── grateful ──
  'grateful|clarity':   'You arrive full. Let\u2019s name exactly what filled you.',
  'grateful|peace':     'Gratitude and peace together. You don\u2019t need anything more today.',
  'grateful|gratitude': 'You arrive full. Let\u2019s honor what fills you.',
  'grateful|courage':   'Gratitude in hard times takes nerve. Let\u2019s begin from here.',

  // ── alive ──
  'alive|clarity':   'You\u2019re awake. Let\u2019s not waste it.',
  'alive|peace':     'Alive and looking for stillness. An interesting combination. Let\u2019s explore.',
  'alive|gratitude': 'Aliveness is the oldest gratitude. Let\u2019s name what lit you up.',
  'alive|courage':   'On fire and fearless. Let\u2019s go.',

  // ── hopeful ──
  'hopeful|clarity':   'Hope points somewhere. Let\u2019s find out where.',
  'hopeful|peace':     'Leaning forward, but gently. That\u2019s a good place to write from.',
  'hopeful|gratitude': 'Hope is a kind of gratitude for what hasn\u2019t happened yet.',
  'hopeful|courage':   'Hope takes courage. You\u2019re already practicing it.',

  // ── light ──
  'light|clarity':   'Unburdened and clear. Let\u2019s notice everything.',
  'light|peace':     'Light today. Let\u2019s protect that.',
  'light|gratitude': 'Lightness is worth naming. Let\u2019s find what lifted.',
  'light|courage':   'It takes courage to let yourself feel light. Stay here.',

  // ── numb ──
  'numb|clarity':   'Even in numbness, something is still noticing. That\u2019s enough.',
  'numb|peace':     'Numbness is the body resting under pressure. we\u2019ll be soft today.',
  'numb|gratitude': 'Finding gratitude from numb is hard. One small thing is enough.',
  'numb|courage':   'Showing up numb is its own courage.',

  // ── quiet ──
  'quiet|clarity':   'The quiet is trying to tell you something. Let\u2019s listen.',
  'quiet|peace':     'Quiet and looking for peace. You might already have it.',
  'quiet|gratitude': 'Quiet gratitude is the deepest kind. Let\u2019s find it.',
  'quiet|courage':   'Quiet courage is still courage. You\u2019re here.',

  // ── foggy ──
  'foggy|clarity':   'Fog and clarity pulling in opposite directions. Let\u2019s find one clear thing.',
  'foggy|peace':     'It\u2019s okay not to see clearly today. We\u2019ll go one step at a time.',
  'foggy|gratitude': 'Gratitude in the fog is brave. Let\u2019s try to find something.',
  'foggy|courage':   'You showed up foggy. That\u2019s not nothing.',

  // ── restless ──
  'restless|clarity':   'Restlessness is energy without direction yet. Let\u2019s point it somewhere.',
  'restless|peace':     'Looking for stillness when something in you is moving. Let\u2019s try.',
  'restless|gratitude': 'Restlessness means you care. What is it you care about?',
  'restless|courage':   'Your restlessness is already a kind of courage. Follow it.',

  // ── searching ──
  'searching|clarity':   'Still looking. Let\u2019s see if we can name what for.',
  'searching|peace':     'Searching is hard to do peacefully. Let\u2019s try anyway.',
  'searching|gratitude': 'Even searching is something to be grateful for. It means you haven\u2019t given up.',
  'searching|courage':   'To keep searching is courage. You haven\u2019t stopped.',

  // ── hard ──
  'hard|clarity':   'Hard days make certain things very clear. Let\u2019s find them.',
  'hard|peace':     'Something weighs on you. We\u2019ll go gently today.',
  'hard|gratitude': 'Finding gratitude on a hard day is its own practice. One small thing.',
  'hard|courage':   'It\u2019s okay to be heavy. Courage doesn\u2019t mean light.',

  // ── heavy ──
  'heavy|clarity':   'Weight can sharpen things. What is most clear to you right now?',
  'heavy|peace':     'Let\u2019s set the weight down, just for a moment.',
  'heavy|gratitude': 'Gratitude alongside heaviness. Both can be true.',
  'heavy|courage':   'You came heavy and you came anyway. That\u2019s the whole thing.',

  // ── overwhelmed ──
  'overwhelmed|clarity':   'When everything blurs, one thing at a time. Just one.',
  'overwhelmed|peace':     'Breathe first. The world can wait a moment.',
  'overwhelmed|gratitude': 'Gratitude is hard when you\u2019re flooded. Even noticing that takes honesty.',
  'overwhelmed|courage':   'You showed up. That\u2019s already brave.',

  // ── sad ──
  'sad|clarity':   'Sadness often knows something the rest of us don\u2019t. Let\u2019s listen to it.',
  'sad|peace':     'Looking for peace in the middle of sadness. Let\u2019s go gently.',
  'sad|gratitude': 'Sadness and gratitude can live in the same breath. Let\u2019s try.',
  'sad|courage':   'Feeling sad and showing up anyway. That\u2019s exactly courage.',

  // ── frustrated ──
  'frustrated|clarity':   'Frustration usually knows what it wants. Let\u2019s name it.',
  'frustrated|peace':     'Looking for calm inside the friction. Let\u2019s see if we can find it.',
  'frustrated|gratitude': 'Frustration means you cared. That caring is worth something.',
  'frustrated|courage':   'Frustrated and still here. That\u2019s what courage looks like most days.',

  // ── anxious ──
  'anxious|clarity':   'Anxiety clouds things. Let\u2019s find one thing that is clear.',
  'anxious|peace':     'The ground is shaky. Let\u2019s find one solid thing.',
  'anxious|gratitude': 'Gratitude when you\u2019re anxious is a small act of defiance. Let\u2019s try.',
  'anxious|courage':   'You\u2019re anxious and you arrived anyway. You\u2019re already doing it.',

  // ── heartbroken ──
  'heartbroken|clarity':   'Heartbreak makes some things terribly clear. You don\u2019t have to look away.',
  'heartbroken|peace':     'Looking for peace when something is broken. Let\u2019s find the smallest quiet.',
  'heartbroken|gratitude': 'Something hurt because it mattered. That mattering is worth naming.',
  'heartbroken|courage':   'Heartbroken and present. That is the bravest thing.',

  // ── disappointed ──
  'disappointed|clarity':   'Disappointment knows exactly what it wanted. Let\u2019s name it honestly.',
  'disappointed|peace':     'The gap between hope and reality is hard. Let\u2019s sit with it gently.',
  'disappointed|gratitude': 'What disappointed you mattered. Gratitude for the wanting, even when it hurts.',
  'disappointed|courage':   'You hoped for something and it didn\u2019t arrive. Staying open takes courage.',

  // ── exhausted ──
  'exhausted|clarity':   'Exhaustion strips things down. What remains is what matters.',
  'exhausted|peace':     'You\u2019re tired. We won\u2019t ask much. One word is enough.',
  'exhausted|gratitude': 'Finding gratitude when you\u2019re depleted is hard. Even trying counts.',
  'exhausted|courage':   'Exhausted and still showing up. That is quiet courage.',

  // ── moved ──
  'moved|clarity':   'Something cracked you open. Let\u2019s name what it was.',
  'moved|peace':     'Being moved settles you in a deeper place. Let\u2019s stay with it.',
  'moved|gratitude': 'To be moved is to be grateful for being alive. Let\u2019s honor what touched you.',
  'moved|courage':   'Letting yourself be moved takes courage. You did that.',

  // ── passionate ──
  'passionate|clarity':   'This fire in you \u2014 let\u2019s see what it\u2019s really about.',
  'passionate|peace':     'Passion this strong deserves a quiet moment to breathe.',
  'passionate|gratitude': 'To feel this alive about something is a gift. Let\u2019s hold it.',
  'passionate|courage':   'Passion asks you to act on it. Let\u2019s begin with why.',

  // ── livid ──
  'livid|clarity':   'Livid is loud. Let\u2019s find what the noise is really saying.',
  'livid|peace':     'Burning and looking for quiet. Let\u2019s hear what the fire needs.',
  'livid|gratitude': 'Anger this real means something matters deeply. Let\u2019s name it.',
  'livid|courage':   'You showed up with all of this. That takes more than you think.',

  // ── nervous ──
  'nervous|clarity':   'Something has your nervous system\u2019s attention. Let\u2019s find out what.',
  'nervous|peace':     'Nervous is just anticipation with no anchor yet. Let\u2019s find one.',
  'nervous|gratitude': 'Nerves mean you care. That caring is worth something.',
  'nervous|courage':   'You showed up nervous. That\u2019s the whole definition of courage.',

  // ── lonely ──
  'lonely|clarity':   'Loneliness is asking for something. Let\u2019s hear what it needs.',
  'lonely|peace':     'Even alone, you arrived. That quiet presence is enough.',
  'lonely|gratitude': 'That you still seek connection shows how alive you are.',
  'lonely|courage':   'Sitting with loneliness without running \u2014 that\u2019s not nothing.',

  // ── ashamed ──
  'ashamed|clarity':   'Shame is rarely accurate. Let\u2019s look at it slowly.',
  'ashamed|peace':     'You don\u2019t have to carry this alone. Let\u2019s set it down here.',
  'ashamed|gratitude': 'The fact that you feel this shows how much you care about who you are.',
  'ashamed|courage':   'Shame tries to make you hide. You came here instead.',

  // ── certain ──
  'certain|clarity':   'Certainty is rare. Let\u2019s name exactly what you know.',
  'certain|peace':     'To be certain is to rest in something solid. Stay a moment.',
  'certain|gratitude': 'Knowing your own mind is a quiet kind of power. Let\u2019s honor it.',
  'certain|courage':   'Certainty can ask things of you. Let\u2019s see where it leads.',

  // ── content ──
  'content|clarity':   'Contentment is easy to overlook. Let\u2019s name what\u2019s here.',
  'content|peace':     'This is the feeling people spend years chasing. You\u2019re in it.',
  'content|gratitude': 'Contentment and gratitude live close to each other. Let\u2019s stay.',
  'content|courage':   'Letting yourself simply be okay \u2014 that takes more than it sounds.',

  // ── focused ──
  'focused|clarity':   'You\u2019re already sharp. Let\u2019s make sure it\u2019s aimed at the right thing.',
  'focused|peace':     'Focus like this is a kind of stillness. Let\u2019s not disrupt it.',
  'focused|gratitude': 'The ability to focus is worth pausing to appreciate.',
  'focused|courage':   'What you\u2019re focused on is asking something of you. Let\u2019s name it.',

  // ── inspired ──
  'inspired|clarity':   'Inspiration is fleeting. Let\u2019s catch what it\u2019s pointing at.',
  'inspired|peace':     'When something lights you up, the world gets quieter. Stay here.',
  'inspired|gratitude': 'To be genuinely inspired is rare. Let\u2019s honor what sparked it.',
  'inspired|courage':   'Inspiration without action fades. Let\u2019s see what it\u2019s asking.',

  // ── lost ──
  'lost|clarity':   'Lost is asking a real question. Let\u2019s try to hear it.',
  'lost|peace':     'Not knowing where you are is still somewhere. You\u2019re here.',
  'lost|gratitude': 'The fact that you want to find your way shows you still care.',
  'lost|courage':   'You showed up even when you don\u2019t know the direction. That counts.',

  // ── relaxed ──
  'relaxed|clarity':   'From this quieter place, what do you actually see?',
  'relaxed|peace':     'Relaxed is what peace feels like in the body. Stay.',
  'relaxed|gratitude': 'This ease is worth noticing. Let\u2019s not let it pass unnamed.',
  'relaxed|courage':   'Letting yourself fully rest \u2014 that takes quiet nerve.',

  // ── vulnerable ──
  'vulnerable|clarity':   'Vulnerability opens things. Let\u2019s see what\u2019s underneath.',
  'vulnerable|peace':     'To be open is to be exactly where healing starts. Stay.',
  'vulnerable|gratitude': 'That you can still be vulnerable means nothing has closed in you.',
  'vulnerable|courage':   'You arrived open. Most people don\u2019t. That matters.',

  // ── yearning ──
  'yearning|clarity':   'Yearning is reaching for something real. Let\u2019s find its name.',
  'yearning|peace':     'That ache is also a kind of love. Let\u2019s sit with it.',
  'yearning|gratitude': 'To yearn is to still believe something better is possible.',
  'yearning|courage':   'Longing this deeply takes a kind of courage. Let\u2019s honor it.',

  // ── betrayed ──
  'betrayed|clarity':   'Betrayal scrambles everything. Let\u2019s start by naming what happened.',
  'betrayed|peace':     'You don\u2019t have to forgive right now. You just have to breathe.',
  'betrayed|gratitude': 'That this hurt you means you trusted. That trust was real.',
  'betrayed|courage':   'You didn\u2019t run from what happened. You showed up to face it.',

  // ── bored ──
  'bored|clarity':   'Boredom is often restlessness with no target yet. Let\u2019s find one.',
  'bored|peace':     'There\u2019s something almost honest about boredom. Let\u2019s sit in it.',
  'bored|gratitude': 'Even an empty day means you\u2019re still here. That\u2019s worth something.',
  'bored|courage':   'Staying present when nothing pulls you \u2014 that\u2019s harder than it looks.',

  // ── insecure ──
  'insecure|clarity':   'Insecurity is pointing at something. Let\u2019s look at it without flinching.',
  'insecure|peace':     'You don\u2019t have to be certain of yourself to belong here.',
  'insecure|gratitude': 'The fact that you want to grow shows something right about you.',
  'insecure|courage':   'You arrived doubting yourself and came anyway. That\u2019s the whole thing.',

  // ── upset ──
  'upset|clarity':   'Upset means something matters. Let\u2019s find out what.',
  'upset|peace':     'You don\u2019t have to resolve this right now. Just let it settle.',
  'upset|gratitude': 'Even when things go wrong, you came here to process it. That\u2019s care.',
  'upset|courage':   'Staying with what upset you instead of pushing it away \u2014 that\u2019s brave.',
};
const BIRTHDAY_HINTS = {
  calm:'Today the chain marks a year of you. Arrive gently.',
  grateful:'Another year. You arrived grateful \u2014 that says everything.',
  hard:'Birthdays don\u2019t ask permission to be hard. You came anyway.',
  heavy:'It\u2019s okay if today feels heavier than expected. The chain holds that too.',
  alive:'A whole year older and you arrive like this. Beautiful.',
  tender:'Something about today made you soft. The chain felt it.',
  numb:'Birthdays can feel strange. You don\u2019t have to perform anything today.',
  anxious:'Another year arrived. So did you. That\u2019s enough.',
  sad:'Some birthdays carry weight. The chain doesn\u2019t ask you to be okay.',
  hopeful:'A new year of you begins today. What are you leaning toward?',
  overwhelmed:'One breath. One knot. That\u2019s the whole birthday ask.',
  exhausted:'Rest is allowed today. You still showed up \u2014 that counts.',
  light:'Light on your birthday. Keep that.',
  quiet:'A quiet birthday. The chain honors that too.',
  foggy:'Even foggy birthdays count. You\u2019re here.',
  restless:'Another year and still searching. That\u2019s not failure \u2014 it\u2019s aliveness.',
  searching:'A new year begins. Maybe what you\u2019re looking for gets closer today.',
  frustrated:'Birthdays don\u2019t pause difficulty. You showed up anyway.',
  heartbroken:'The chain holds birthday grief too. You don\u2019t have to be okay.',
  disappointed:'Not every birthday arrives the way you hoped. The chain knows.',
  moved:'Something moved you on your birthday. The chain will remember.',
  passionate:'A year older and still burning. Keep that.',
  nervous:'Birthdays come with their own flutter. The chain holds that too.',
  livid:'Even livid birthdays count. You showed up with all of it.',
  lonely:'Some birthdays arrive quietly. You\u2019re not alone here.',
  ashamed:'Birthdays don\u2019t ask you to be proud. Just to arrive. You did.',
  certain:'A clear-eyed birthday. The chain takes your word for it.',
  content:'Enough on your birthday \u2014 that is a rare gift.',
  focused:'Birthdays with aim. Tell the chain where you\u2019re pointed.',
  inspired:'Sparked on your birthday. Follow it \u2014 the chain is ready.',
  lost:'Not every birthday brings a compass. You arrived without one. That\u2019s enough.',
  relaxed:'An easy birthday. Let it be easy. The chain doesn\u2019t need more.',
  vulnerable:'Birthdays open you. You came with it open. That\u2019s brave.',
  yearning:'Some birthdays come full of wanting. The chain knows that ache.',
  betrayed:'Even on your birthday, some wounds show. The chain holds that too.',
  bored:'A flat birthday is still a birthday. You\u2019re here. That counts.',
  insecure:'Birthdays can make you small. You showed up anyway.',
  upset:'Upset on your birthday is honest. The chain takes it as it is.'
};
const ARRIVAL_FALLBACK = {
  calm:'A quiet arrival. Let\u2019s begin gently.',tender:'Something soft in you today.',
  grateful:'You arrive full. Let\u2019s honor that.',hard:'It\u2019s a hard one. We\u2019re here.',
  heavy:'Heavy today. We\u2019ll go slow.',overwhelmed:'One word at a time.',
  alive:'You\u2019re awake. Let\u2019s use it.',numb:'Numb is still here. That counts.',
  hopeful:'Leaning forward today. Let\u2019s honor that.',light:'Unburdened. Let\u2019s notice it.',
  quiet:'Just here. That\u2019s enough.',foggy:'The fog is honest. One step.',
  restless:'Something in you is moving. Let\u2019s follow it.',searching:'Still looking. That matters.',
  sad:'Sadness arrived. We\u2019ll be gentle.',frustrated:'Blocked. But still here.',
  anxious:'The ground is shaky. Let\u2019s find one solid thing.',heartbroken:'Broken. But present.',
  disappointed:'Something didn\u2019t arrive. We\u2019ll name it.',exhausted:'Tired. One word is enough.',
  moved:'Something touched you. Let\u2019s hold it.',
  passionate:'Something lit up in you today. Let\u2019s follow it.',
  nervous:'A little trembling. That\u2019s honest. We\u2019ll go slow.',
  livid:'Burning with it. That\u2019s information. Let\u2019s listen.',
  lonely:'Solitude showed up. The chain\u2019s here with you.',
  ashamed:'You came anyway. That is already brave.',
  certain:'Clear today. Let\u2019s name what you know.',
  content:'Enough is here. Let\u2019s notice it.',
  focused:'Pointed and present. Let\u2019s use it.',
  inspired:'Something sparked. Don\u2019t let it pass.',
  lost:'No compass today. We\u2019ll start with one step.',
  relaxed:'At ease. Let\u2019s honor it.',
  vulnerable:'Something in you is open. We\u2019ll be gentle.',
  yearning:'Wanting is honest. Let\u2019s name what.',
  betrayed:'Something broke that shouldn\u2019t have. We\u2019ll start where you are.',
  bored:'Flat is a weather too. It still counts.',
  insecure:'Shaky ground today. One small solid thing.',
  upset:'Disturbed. The chain takes it as it is.',
};

