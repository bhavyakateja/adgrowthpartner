import {
  INTRO_ATTR,
  INTRO_FAILSAFE_MS,
  INTRO_REPLAY_AFTER_MS,
  INTRO_REPLAY_PARAM,
  INTRO_SKIP_ON_REDUCED_MOTION,
  INTRO_STORAGE_KEY,
} from "./intro-config";

/**
 * Server component. Render it as the FIRST child of <body>, before
 * <IntroAnimation />.
 *
 * It runs synchronously during HTML parsing — before the browser paints
 * anything below it — and decides "play" vs "skip" for this page load. That
 * means:
 *   • the site never flashes before the overlay appears,
 *   • returning visitors never see the overlay flash before it disappears,
 *   • scroll is locked from the very first frame, not after hydration.
 */

const script = `(function(){
var d=document.documentElement,A=${JSON.stringify(INTRO_ATTR)},mode="play";
try{
if(location.search.indexOf(${JSON.stringify(INTRO_REPLAY_PARAM)})<0){
var rm=${INTRO_SKIP_ON_REDUCED_MOTION}&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var last=0;
try{last=+sessionStorage.getItem(${JSON.stringify(INTRO_STORAGE_KEY)})||0}catch(e){}
if(rm||(last&&Date.now()-last<${INTRO_REPLAY_AFTER_MS}))mode="skip";
}
}catch(e){}
d.setAttribute(A,mode);
if(mode!=="play")return;
var t;
function arm(){clearTimeout(t);if(!document.hidden)t=setTimeout(function(){d.setAttribute(A,"done")},${INTRO_FAILSAFE_MS})}
document.addEventListener("visibilitychange",arm);arm();
})();`;

/* Global rules live here (not in the CSS module) because CSS Modules only
   allows selectors that contain a local class. */
const css = `
html[${INTRO_ATTR}="play"]{overflow:hidden;scrollbar-gutter:stable}
html[${INTRO_ATTR}="skip"] [data-intro-overlay],
html[${INTRO_ATTR}="done"] [data-intro-overlay]{display:none!important}
`;

export default function IntroBootstrap() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {/* No JS at all → never block the site behind the overlay. */}
      <noscript>
        <style>{`[data-intro-overlay]{display:none!important}`}</style>
      </noscript>
    </>
  );
}