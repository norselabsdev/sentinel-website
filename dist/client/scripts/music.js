// ─── Ambient music control ───
// Extracted verbatim from the original single-file bundle's inline <script>.
// Sound is OFF by default: no autoplay attempt, no document-wide gesture
// listeners. Music starts ONLY when the visitor clicks the sound button
// (synchronous play() inside the gesture frame, matched music+video restart
// from 0). See the project CLAUDE.md "Music OFF by default (v9)" notes for the
// full behavioral contract (pause sentinel, matched restart, no muted-fade-up).
//
// Loaded as a plain classic script from the layout AFTER the #sn-music markup
// exists in the DOM. It operates on #sn-music-btn / #sn-music-audio /
// #sn-music-label and the first <video> on the page (the hero).
(function () {
  var btn = document.getElementById('sn-music-btn');
  var audio = document.getElementById('sn-music-audio');
  var label = document.getElementById('sn-music-label');
  if (!btn || !audio) return;
  var TARGET_VOL = 0.32;
  var START_VOL = 0.06;       // first audible moment - hearable at once, then fades up
  var fadeTimer = null;
  var userMuted = true;       // the button is a pure intent toggle; this IS its state
  var audible = false;        // sound is actually reaching the speakers
  var restartOnStart = false; // next SUCCESSFUL audible start restarts music+video from 0
  var startedAt = 0;          // last gesture-start attempt (for the pause sentinel)
  var retried = false;        // sentinel already retried for this attempt

  function stopFade() {
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
  }

  function fadeTo(target, ms) {
    stopFade();
    var step = (target - audio.volume) / Math.max(1, ms / 50);
    fadeTimer = setInterval(function () {
      var v = audio.volume + step;
      if ((step >= 0 && v >= target) || (step < 0 && v <= target)) {
        audio.volume = target;
        stopFade();
      } else {
        audio.volume = v;
      }
    }, 50);
  }

  function setUi(on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    var msg = on ? 'Mute ambient music' : 'Unmute ambient music';
    btn.setAttribute('aria-label', msg);
    btn.title = msg;
    if (label) label.textContent = on ? 'Sound · on' : 'Sound · off';
  }

  // Matched start: when a restart is owed (blocked load's first audible
  // start, or the button toggling sound back ON), seek music AND hero
  // video to 0 so they begin together. Runs only AFTER play() succeeded -
  // a restart without surviving sound reads as the video glitching back
  // to the beginning (the v6/v7 bug class).
  function syncRestart() {
    if (!restartOnStart) return;
    restartOnStart = false;
    try {
      audio.currentTime = 0;
      var vid = document.querySelector('video');
      if (vid) {
        vid.currentTime = 0;
        if (vid.paused) {
          var vp = vid.play();
          if (vp && vp.catch) vp.catch(function (err) {
            console.warn('[sn-music] hero video restart play failed:', err && err.name);
          });
        }
      }
    } catch (err) {
      console.warn('[sn-music] matched restart failed:', err && err.name);
    }
  }

  function onStarted() {
    audible = true;
    syncRestart();
    setUi(true);
    fadeTo(TARGET_VOL, 1200);
  }

  // A start failed or the browser paused us: go silent. Mute BEFORE
  // pausing so the sentinel ignores our own deliberate pauses. Any owed
  // restart stays owed; the gesture listeners stay armed.
  function goSilent() {
    audible = false;
    stopFade();
    audio.muted = true;
    audio.pause();
  }

  // One-click guarantee: runs synchronously inside the gesture frame
  // (play() must never be deferred to a promise callback) at an instantly
  // audible volume.
  function gestureStart() {
    startedAt = Date.now();
    retried = false;
    stopFade();
    audio.muted = false;
    audio.volume = START_VOL;
    if (audio.paused) {
      var p = audio.play();
      if (p && p.then) {
        p.then(onStarted).catch(function (err) {
          console.warn('[sn-music] gesture play rejected:', err && err.name);
          goSilent();
        });
      } else {
        onStarted();
      }
    } else {
      onStarted();
    }
  }

  // Intervention sentinel: Firefox can pause the track AFTER play()
  // resolved. If that lands right after a gesture the document still
  // carries user activation - retry audibly once. Otherwise go silent
  // and wait for the next gesture. Deliberate pauses mute first, so the
  // audio.muted guard filters them out here.
  audio.addEventListener('pause', function () {
    if (userMuted || audio.muted || audio.ended) return;
    stopFade();
    audible = false;
    if (Date.now() - startedAt < 2500 && !retried) {
      retried = true;
      console.warn('[sn-music] paused right after a gesture - retrying audible playback');
      if (audio.volume < START_VOL) audio.volume = START_VOL;
      var p = audio.play();
      if (p && p.then) {
        p.then(onStarted).catch(function (err) {
          console.warn('[sn-music] audible retry rejected:', err && err.name);
          goSilent();
        });
      } else {
        onStarted();
      }
      return;
    }
    console.warn('[sn-music] browser paused the track; sound returns on the next click/key/tap');
    goSilent();
  });

  // Pure intent toggle, default OFF: the first click turns sound ON with a
  // matched music+video start from 0; the next click mutes again.
  btn.addEventListener('click', function () {
    if (!userMuted) {
      userMuted = true;
      goSilent();
      setUi(false);
    } else {
      userMuted = false;
      restartOnStart = true;
      setUi(true);
      gestureStart();
    }
  });

  // Sound is OFF by default: no autoplay attempt, no document-wide gesture
  // listeners. Music starts ONLY when the visitor clicks the sound button
  // (synchronous play() inside the gesture frame, matched restart from 0).
  setUi(false);
  audio.muted = true;
  restartOnStart = true; // first ON = matched music+video start from 0
})();
