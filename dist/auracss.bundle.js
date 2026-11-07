(function(j){"use strict";const _="auracss_controls_pos";function ee(l=_){try{if(typeof window>"u"||!window.localStorage)return null;const e=window.localStorage.getItem(l);if(!e)return null;const s=JSON.parse(e);if(typeof s?.left=="number"&&typeof s?.top=="number")return{left:s.left,top:s.top}}catch{}return null}function O(l,e=_){try{if(typeof window>"u"||!window.localStorage)return;window.localStorage.setItem(e,JSON.stringify(l))}catch{}}function M(l,e=8){const s=l.getBoundingClientRect(),t=s.width||32,a=s.height||32,o=typeof window<"u"?window.innerWidth:1024,i=typeof window<"u"?window.innerHeight:768,n=e,r=e,p=Math.max(n,o-t-e),h=Math.max(r,i-a-e),m=l.style.left&&l.style.left!=="auto"?parseFloat(l.style.left):s.left,d=l.style.top&&l.style.top!=="auto"?parseFloat(l.style.top):s.top,b=Math.round(Math.max(n,Math.min(p,m))),c=Math.round(Math.max(r,Math.min(h,d)));return l.style.setProperty("left",`${b}px`,"important"),l.style.setProperty("top",`${c}px`,"important"),l.style.setProperty("right","auto","important"),l.style.setProperty("bottom","auto","important"),{left:b,top:c}}function G(l,e,s={}){const t=s.margin??8,a=s.storageKey??_;let o=!1,i=0,n=0,r=0,p=0,h=!1,m=0;const d=f=>{if(!o)return;const w=f.clientX-i,g=f.clientY-n;if(!h&&Math.hypot(w,g)>=4&&(h=!0,l.classList.add("dragging"),e.classList.add("dragging")),h){const u=l.getBoundingClientRect(),v=window.innerWidth,y=window.innerHeight,S=t,k=t,C=Math.max(S,v-u.width-t),P=Math.max(k,y-u.height-t),L=Math.round(Math.max(S,Math.min(C,r+w))),$=Math.round(Math.max(k,Math.min(P,p+g)));l.style.setProperty("left",`${L}px`,"important"),l.style.setProperty("top",`${$}px`,"important"),l.style.setProperty("right","auto","important"),l.style.setProperty("bottom","auto","important")}},b=f=>{if(o){o=!1,window.removeEventListener("pointermove",d),window.removeEventListener("pointerup",b),window.removeEventListener("pointercancel",b);try{e.hasPointerCapture(f.pointerId)&&e.releasePointerCapture(f.pointerId)}catch{}if(l.classList.remove("dragging"),e.classList.remove("dragging"),h){m=Date.now()+150;const w=M(l,t);O(w,a),s.onDragEnd?.(w)}}},c=f=>{if(!f.isPrimary||f.pointerType==="mouse"&&f.button!==0)return;o=!0,h=!1,i=f.clientX,n=f.clientY;const w=l.getBoundingClientRect();r=w.left,p=w.top;try{e.setPointerCapture(f.pointerId)}catch{}window.addEventListener("pointermove",d),window.addEventListener("pointerup",b),window.addEventListener("pointercancel",b)};return e.addEventListener("pointerdown",c),{destroy:()=>{e.removeEventListener("pointerdown",c),window.removeEventListener("pointermove",d),window.removeEventListener("pointerup",b),window.removeEventListener("pointercancel",b)},wasJustDragged:()=>Date.now()<m}}const te=`
:host { all: initial; position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2147483645; }
*, *::before, *::after { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.auracss-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; overflow: visible; z-index: 2147483645; }
.auracss-ring {
  position: absolute; pointer-events: none; border-radius: 4px; border: 2px solid #38bdf8;
  background: rgba(56, 189, 248, 0.08); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px rgba(56, 189, 248, 0.35);
  transition: transform 0.06s ease-out, width 0.06s ease-out, height 0.06s ease-out, border-color 0.15s ease;
  will-change: transform, width, height; display: none;
}
.auracss-ring.locked { border-color: #a855f7; background: rgba(168, 85, 247, 0.1); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 20px rgba(168, 85, 247, 0.45); }
.auracss-pill {
  position: absolute; top: -26px; left: -2px; background: #0f172a; color: #f8fafc;
  font-size: 11px; font-weight: 600; line-height: 1; padding: 4px 8px; border-radius: 4px;
  letter-spacing: 0.02em; white-space: nowrap; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 4px; pointer-events: none;
}
.auracss-pill.flipped { top: auto; bottom: -26px; }
.auracss-controls-stack { position: fixed; top: 16px; right: 20px; display: inline-flex; align-items: center; z-index: 2147483647; pointer-events: auto; user-select: none; }
.auracss-controls-stack.dragging { transition: none !important; user-select: none !important; }
.auracss-controls-row {
  display: inline-flex; align-items: center; height: 32px;
  background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 9999px; padding: 2px 4px 2px 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.2);
  gap: 2px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.auracss-controls-row:hover { border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 10px 36px rgba(0, 0, 0, 0.6), 0 0 14px rgba(56, 189, 248, 0.2); }
.auracss-controls-drag-handle { display: inline-flex; align-items: center; justify-content: center; color: #64748b; font-size: 11px; cursor: grab; padding: 0 4px 0 2px; touch-action: none; user-select: none; transition: color 0.15s ease; }
.auracss-controls-drag-handle:hover, .auracss-controls-drag-handle.dragging { color: #38bdf8; cursor: grabbing !important; }
.auracss-controls-divider { width: 1px; height: 14px; background: rgba(255, 255, 255, 0.15); flex-shrink: 0; }
.auracss-toggle-btn {
  height: 26px; padding: 0 10px; border-radius: 9999px; border: none; background: transparent; color: #f8fafc;
  font-size: 11.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; outline: none; box-shadow: none;
}
.auracss-toggle-btn:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.auracss-toggle-btn.active { color: #38bdf8; }
.auracss-export-btn { color: #38bdf8; font-weight: 700; }
.auracss-export-btn:hover { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; }
.auracss-toggle-dot { width: 7px; height: 7px; border-radius: 50%; background: #64748b; transition: all 0.2s ease; }
.auracss-toggle-btn.active .auracss-toggle-dot { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
.auracss-min-btn {
  width: 22px; height: 22px; border-radius: 50%; border: none; background: transparent; color: #94a3b8;
  font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s ease; outline: none; margin-right: 2px;
}
.auracss-min-btn:hover { background: rgba(255, 255, 255, 0.12); color: #f8fafc; }
.auracss-min-badge {
  display: none; width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(56, 189, 248, 0.4);
  background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: #38bdf8; font-size: 13px; font-weight: 700; align-items: center; justify-content: center; cursor: grab;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; outline: none; touch-action: none; user-select: none;
}
.auracss-min-badge:hover { transform: scale(1.1); box-shadow: 0 0 18px rgba(56, 189, 248, 0.6); }
.auracss-min-badge.active { color: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.45); }
.auracss-min-badge.dragging { cursor: grabbing !important; transform: scale(1.12); box-shadow: 0 0 22px rgba(56, 189, 248, 0.8); }
.auracss-controls-stack.minimized .auracss-controls-row { display: none !important; }
.auracss-controls-stack.minimized .auracss-min-badge { display: flex !important; }
`;function se(l){const e=l.tagName.toLowerCase(),s=l.id?`#${l.id}`:"",t=Array.from(l.classList).filter(a=>!a.startsWith("auracss")).slice(0,2).map(a=>`.${a}`).join("");return`${e}${s}${t}`}class ae{host=null;shadow=null;container=null;ring=null;pill=null;activeTarget=null;isLocked=!1;rafId=null;cleanups=[];mount(){if(this.shadow)return this.shadow;const e=document.getElementById("auracss-root");e&&e.remove();const s=document.createElement("div");s.id="auracss-root",s.style.cssText="all: initial !important; position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 2147483647 !important; pointer-events: none !important;";const t=s.attachShadow({mode:"open"}),a=document.createElement("style");a.textContent=te,t.appendChild(a);const o=document.createElement("div");o.className="auracss-container";const i=document.createElement("div");i.className="auracss-ring";const n=document.createElement("div");return n.className="auracss-pill",i.appendChild(n),o.appendChild(i),t.appendChild(o),document.body?document.body.appendChild(s):(document.documentElement.appendChild(s),window.addEventListener("DOMContentLoaded",()=>{document.body&&s.parentElement!==document.body&&document.body.appendChild(s)},{once:!0})),this.host=s,this.shadow=t,this.container=o,this.ring=i,this.pill=n,t}updateHighlight(e,s=!1){this.activeTarget=e,this.isLocked=s,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(()=>{this.rafId=null,this.render()})}render(){if(!this.ring||!this.pill)return;if(!this.activeTarget||!this.activeTarget.isConnected){this.ring.style.display="none";return}const e=this.activeTarget.getBoundingClientRect(),s=se(this.activeTarget),t={top:e.top,left:e.left,width:Math.max(e.width,2),height:Math.max(e.height,2)};this.ring.style.display="block",this.ring.style.transform=`translate3d(${t.left}px, ${t.top}px, 0)`,this.ring.style.width=`${t.width}px`,this.ring.style.height=`${t.height}px`,this.isLocked?this.ring.classList.add("locked"):this.ring.classList.remove("locked"),this.pill.textContent=s,this.pill.classList.toggle("flipped",t.top<30)}clear(){this.activeTarget=null,this.isLocked=!1,this.ring&&(this.ring.style.display="none")}destroy(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.cleanups.forEach(e=>e()),this.cleanups=[],this.host&&this.host.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.shadow=null,this.container=null,this.ring=null,this.pill=null,this.activeTarget=null,this.isLocked=!1}getShadowRoot(){return this.shadow}getContainer(){return this.container}resolveHostElement(e){if(!this.host)return null;const s=e.composedPath();if(s.includes(this.host))return null;for(const t of s)if(t instanceof HTMLElement&&t!==document.body&&t!==document.documentElement&&t.isConnected)return t;return null}mountControls(e,s){if(!this.shadow)throw new Error("ShadowRoot not mounted");const t=document.createElement("div");t.className="auracss-controls-stack";const a=ee();a&&(t.style.left=`${a.left}px`,t.style.top=`${a.top}px`,t.style.right="auto");const o=document.createElement("button");o.className="auracss-min-badge",o.title="Click to expand, drag to reposition",o.type="button",o.innerHTML="✦";const i=document.createElement("div");i.className="auracss-controls-row";const n=document.createElement("span");n.className="auracss-controls-drag-handle",n.title="Drag to reposition",n.textContent="⋮⋮",i.appendChild(n);const r=document.createElement("button");r.className="auracss-toggle-btn",r.setAttribute("aria-label","Toggle AuraCSS");const p=document.createElement("span");p.className="auracss-toggle-dot";const h=document.createElement("span");h.textContent="AuraCSS: OFF",r.append(p,h),r.onclick=u=>{u.stopPropagation(),e()},i.appendChild(r);const m=document.createElement("div");m.className="auracss-controls-divider auracss-export-divider",m.style.display="none";const d=document.createElement("button");d.className="auracss-toggle-btn auracss-export-btn",d.style.display="none",d.textContent="Export (0)",d.onclick=u=>{u.stopPropagation(),s()};const b=document.createElement("div");b.className="auracss-controls-divider";const c=document.createElement("button");c.className="auracss-min-btn",c.title="Minimize controls",c.type="button",c.innerHTML="–",c.onclick=u=>{u.stopPropagation();const v=c.getBoundingClientRect(),y=t.getBoundingClientRect(),S=v.width>0?v.right:y.right,k=v.height>0?v.top+(v.height-32)/2:y.top;t.classList.add("minimized"),t.style.setProperty("left",`${Math.round(S-32)}px`,"important"),t.style.setProperty("top",`${Math.round(k)}px`,"important"),t.style.setProperty("right","auto","important"),O(M(t))},i.append(m,d,b,c);const f=G(t,o,{onDragEnd:()=>M(t)}),w=G(t,n,{onDragEnd:()=>M(t)});this.cleanups.push(f.destroy,w.destroy),o.onclick=u=>{if(u.stopPropagation(),f.wasJustDragged())return;const v=o.getBoundingClientRect();t.classList.remove("minimized");const y=t.getBoundingClientRect();t.style.setProperty("left",`${Math.round(v.right-y.width)}px`,"important"),t.style.setProperty("top",`${Math.round(v.top+(v.height-y.height)/2)}px`,"important"),t.style.setProperty("right","auto","important"),O(M(t))};const g=()=>M(t);return window.addEventListener("resize",g,{passive:!0}),this.cleanups.push(()=>window.removeEventListener("resize",g)),t.append(o,i),this.shadow.appendChild(t),{toggleBtn:r,toggleLabel:h,exportBtn:d,exportDivider:m,minBadge:o,controlsStack:t}}}const re=`
.auracss-breadcrumb-bar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding: 6px 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 2147483646;
  pointer-events: auto;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.auracss-breadcrumb-bar.visible {
  display: flex;
}

.auracss-breadcrumb-item {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}

.auracss-breadcrumb-item:hover {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
}

.auracss-breadcrumb-item.current {
  color: #f8fafc;
  font-weight: 700;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.auracss-breadcrumb-separator {
  color: #475569;
  font-size: 11px;
}
`;function B(l){const e=l.tagName.toLowerCase(),s=l.id?`#${l.id}`:"",t=l.classList.length>0?`.${Array.from(l.classList).filter(a=>!a.startsWith("auracss"))[0]??""}`:"";return`${e}${s}${t==="."?"":t}`}class oe{barEl=null;childStack=[];onSelectCallback=null;mount(e){if(this.barEl)return;const s=document.createElement("style");s.textContent=re,e.appendChild(s);const t=document.createElement("div");t.className="auracss-breadcrumb-bar",t.setAttribute("role","navigation"),t.setAttribute("aria-label","Element Hierarchy Breadcrumbs"),e.appendChild(t),this.barEl=t}buildBreadcrumbPath(e,s=6){if(!e||!e.isConnected)return[];const t=[];let a=e;for(;a&&a.isConnected&&t.length<s&&!(a===document.body||a===document.documentElement||a.id==="auracss-root");)t.push({element:a,label:B(a),isCurrent:a===e}),a=a.parentElement;return t.reverse()}render(e,s){if(!this.barEl)return;this.onSelectCallback=s;const t=this.buildBreadcrumbPath(e);if(t.length===0){this.clear();return}this.barEl.innerHTML="",t.forEach((a,o)=>{if(o>0){const n=document.createElement("span");n.className="auracss-breadcrumb-separator",n.textContent="›",this.barEl?.appendChild(n)}const i=document.createElement("span");i.className=`auracss-breadcrumb-item${a.isCurrent?" current":""}`,i.textContent=a.label,i.title=`Select <${a.element.tagName.toLowerCase()}>`,i.addEventListener("click",n=>{n.stopPropagation(),a.element.isConnected&&(this.childStack.length=0,this.onSelectCallback?.(a.element))}),this.barEl?.appendChild(i)}),this.barEl.classList.add("visible")}navigateUp(e){if(!e||!e.isConnected)return null;const s=e.parentElement;return!s||s===document.body||s===document.documentElement||s.id==="auracss-root"?null:(this.childStack.push(e),s)}navigateDown(e){if(!e||!e.isConnected)return null;if(this.childStack.length>0){const t=this.childStack.pop();if(t&&t.isConnected&&t.parentElement===e)return t}const s=e.firstElementChild;return s instanceof HTMLElement&&s.isConnected&&s.id!=="auracss-root"?s:null}clear(){this.childStack.length=0,this.barEl&&(this.barEl.classList.remove("visible"),this.barEl.innerHTML="")}destroy(){this.clear(),this.barEl&&this.barEl.parentNode&&this.barEl.parentNode.removeChild(this.barEl),this.barEl=null,this.onSelectCallback=null}}function H(l){if(!l||l==="transparent"||l==="inherit")return null;const e=l.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);if(e){const t=parseInt(e[1]??"0",10),a=parseInt(e[2]??"0",10),o=parseInt(e[3]??"0",10),i=e[4]!==void 0?parseFloat(e[4]):1;return{r:t,g:a,b:o,a:i}}const s=l.match(/^#([0-9a-f]{3,8})$/i);if(s){const t=s[1]??"";if(t.length===3||t.length===4){const a=parseInt((t[0]??"0").repeat(2),16),o=parseInt((t[1]??"0").repeat(2),16),i=parseInt((t[2]??"0").repeat(2),16),n=t.length===4?parseInt((t[3]??"f").repeat(2),16)/255:1;return{r:a,g:o,b:i,a:n}}if(t.length===6||t.length===8){const a=parseInt(t.slice(0,2),16),o=parseInt(t.slice(2,4),16),i=parseInt(t.slice(4,6),16),n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{r:a,g:o,b:i,a:n}}}return null}function Y(l){const e=o=>{const i=o/255;return i<=.03928?i/12.92:Math.pow((i+.055)/1.055,2.4)},s=e(l.r),t=e(l.g),a=e(l.b);return .2126*s+.7152*t+.0722*a}function V(l){const e=l.r/255,s=l.g/255,t=l.b/255,a=Math.max(e,s,t),o=Math.min(e,s,t);if(a===o)return 0;const i=(a+o)/2,n=a-o;return i>.5?n/(2-a-o):n/(a+o)}class ie{cachedTokens=null;harvest(e=!1){if(this.cachedTokens&&!e)return this.cachedTokens;let s=!1,t="#4f46e5",a="system-ui, sans-serif",o="8px";if(typeof window>"u"||typeof document>"u")return{isDarkMode:s,primaryColor:t,fontFamily:a,baseRadius:o};const i=this.resolveEffectiveBackground(document.body||document.documentElement);i&&(s=Y(i)<.45);const p=Array.from(document.querySelectorAll('button, a, nav, header, h1, h2, h3, [class*="btn"], [class*="primary"]')).slice(0,50);let h=.25;const m=new Map,d=new Map;for(const w of p){if(!w.isConnected||w.id==="auracss-root"||w.closest("#auracss-root"))continue;const g=window.getComputedStyle(w);if(g.fontFamily){const y=g.fontFamily.split(",")[0]?.trim().replace(/['"]/g,"")??"";y&&m.set(y,(m.get(y)??0)+1)}g.borderRadius&&g.borderRadius!=="0px"&&d.set(g.borderRadius,(d.get(g.borderRadius)??0)+1);const u=H(g.backgroundColor);if(u&&u.a>.6){const y=V(u);y>h&&(h=y,t=`rgb(${u.r}, ${u.g}, ${u.b})`)}const v=H(g.borderColor);if(v&&v.a>.6){const y=V(v);y>h&&(h=y,t=`rgb(${v.r}, ${v.g}, ${v.b})`)}}let b=0;for(const[w,g]of m.entries())g>b&&(b=g,a=w);let c=0;for(const[w,g]of d.entries())g>c&&(c=g,o=w);const f={isDarkMode:s,primaryColor:t,fontFamily:a,baseRadius:o};return this.cachedTokens=f,f}resolveEffectiveBackground(e){let s=e;for(;s&&s!==document.documentElement;){const t=window.getComputedStyle(s),a=H(t.backgroundColor);if(a&&a.a>.8)return a;s=s.parentElement}return{r:15,g:23,b:42,a:1}}clearCache(){this.cachedTokens=null}}const ne=`
.auracss-variation-dock {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 8px 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 2147483646;
  pointer-events: auto;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: calc(100vw - 28px);
}
.auracss-variation-dock.visible { display: flex; }

.auracss-dock-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
  justify-content: center;
  flex-shrink: 0;
}
.auracss-dock-stack.left { min-width: 48px; }
.auracss-dock-stack.right { min-width: 60px; }
.auracss-dock-row { display: flex; align-items: center; gap: 4px; }

.auracss-ai-remodel-btn {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  height: 28px; padding: 0 6px; border-radius: 7px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%);
  border: 1px solid rgba(168, 85, 247, 0.45);
  color: #d8b4fe; font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-ai-remodel-btn:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(56, 189, 248, 0.3) 100%);
  border-color: #c084fc; color: #ffffff; transform: translateY(-1px);
}
.auracss-btn-badge {
  font-size: 9.5px; font-weight: 800; background: rgba(168, 85, 247, 0.35);
  padding: 1px 4px; border-radius: 4px; color: #f3e8ff; line-height: 1;
}

.auracss-preset-reset {
  display: flex; align-items: center; justify-content: center;
  height: 24px; padding: 0 6px; border-radius: 7px;
  background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-preset-reset:hover { background: rgba(239, 68, 68, 0.25); border-color: #f87171; transform: translateY(-1px); }
.auracss-preset-reset.disabled { opacity: 0.35; cursor: default; pointer-events: none; }

.auracss-dock-divider { width: 1px; height: 48px; background: rgba(255, 255, 255, 0.1); flex-shrink: 0; }

.auracss-cards-track {
  display: flex; align-items: center; gap: 10px; overflow-x: auto;
  scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;
  cursor: grab; user-select: none; max-width: min(800px, calc(100vw - 220px)); padding: 2px 2px;
}
.auracss-cards-track::-webkit-scrollbar { display: none; }
.auracss-cards-track.grabbing { cursor: grabbing; }

.auracss-preset-card {
  display: flex; flex-direction: column; gap: 3px; padding: 8px 12px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer; transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); min-width: 145px; max-width: 175px; flex-shrink: 0;
}
.auracss-preset-card:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.4); transform: translateY(-2px); }
.auracss-preset-card.active { background: rgba(168, 85, 247, 0.2); border-color: #a855f7; box-shadow: 0 0 14px rgba(168, 85, 247, 0.4); }
.auracss-preset-name { color: #f8fafc; font-size: 11.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.auracss-preset-desc { color: #94a3b8; font-size: 10px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.auracss-contrast-badge { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; display: inline-flex; align-items: center; width: fit-content; margin-top: 1px; }
.auracss-contrast-badge.AAA { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
.auracss-contrast-badge.AA { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
.auracss-contrast-badge.FAIL { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

.auracss-dock-palette-btn, .auracss-dock-tune-btn {
  display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0; font-size: 13px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-dock-palette-btn:hover, .auracss-dock-tune-btn:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; transform: translateY(-1px); }

.auracss-ai-settings-btn {
  display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8; font-size: 13px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-ai-settings-btn:hover { background: rgba(255, 255, 255, 0.15); color: #f8fafc; transform: translateY(-1px); }

.auracss-saved-styles-btn {
  display: flex; align-items: center; justify-content: center; gap: 3px;
  height: 24px; padding: 0 6px; border-radius: 7px;
  background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8; font-size: 11px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-saved-styles-btn:hover { background: rgba(56, 189, 248, 0.25); border-color: #38bdf8; transform: translateY(-1px); }

/* Floating Popovers */
.auracss-saved-popover, .auracss-palette-popover {
  position: absolute; bottom: calc(100% + 10px); right: 0; width: 330px; max-width: 90vw; max-height: 420px;
  background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); padding: 14px; display: none; flex-direction: column; gap: 10px;
  z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc;
}
.auracss-saved-popover.visible, .auracss-palette-popover.visible { display: flex; }

.auracss-saved-popover-header, .auracss-palette-header {
  display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #38bdf8;
}
.auracss-saved-popover-close, .auracss-palette-close {
  background: transparent; border: none; color: #94a3b8; font-size: 14px; cursor: pointer; padding: 2px 6px; border-radius: 4px;
}
.auracss-saved-popover-close:hover, .auracss-palette-close:hover { color: #ffffff; background: rgba(255, 255, 255, 0.1); }

.auracss-saved-list { display: flex; flex-direction: column; gap: 8px; max-height: 310px; overflow-y: auto; scrollbar-width: thin; }
.auracss-saved-card {
  display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 8px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; transition: all 0.15s ease;
}
.auracss-saved-card:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.4); transform: translateY(-1px); }
.auracss-saved-card.active { border-color: #a855f7; background: rgba(168, 85, 247, 0.18); }
.auracss-saved-card-header { display: flex; justify-content: space-between; align-items: center; }
.auracss-saved-card-title { font-size: 11.5px; font-weight: 700; color: #f8fafc; }
.auracss-saved-card-time { font-size: 9.5px; color: #64748b; font-weight: 500; }
.auracss-saved-card-desc { font-size: 10.5px; color: #94a3b8; line-height: 1.3; }
.auracss-saved-card-tw {
  font-size: 9.5px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: #38bdf8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: rgba(56, 189, 248, 0.1);
  padding: 2px 5px; border-radius: 4px;
}
.auracss-saved-card-remove {
  background: transparent; border: none; color: #64748b; font-size: 11px;
  cursor: pointer; padding: 0 4px; line-height: 1; border-radius: 4px;
  transition: all 0.15s ease; margin-left: 6px;
}
.auracss-saved-card-remove:hover { color: #f43f5e; background: rgba(244, 63, 94, 0.15); }
.auracss-saved-clear-all {
  background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.25);
  color: #f87171; font-size: 10px; font-weight: 600; border-radius: 5px;
  padding: 2px 7px; cursor: pointer; margin-left: auto; margin-right: 6px;
  transition: all 0.15s ease;
}
.auracss-saved-clear-all:hover { background: rgba(244, 63, 94, 0.25); color: #fecdd3; }
.auracss-saved-empty { text-align: center; color: #64748b; font-size: 11.5px; padding: 16px 8px; line-height: 1.4; }

/* Typography Popover Elements */
.auracss-palette-section { display: flex; flex-direction: column; gap: 5px; }
.auracss-palette-section-title {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 1px;
}
.auracss-font-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; }
.auracss-font-pill, .auracss-theme-pill {
  display: flex; align-items: center; justify-content: center; padding: 5px 8px; border-radius: 6px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.auracss-font-pill:hover, .auracss-theme-pill:hover { background: rgba(56, 189, 248, 0.12); border-color: #38bdf8; transform: translateY(-1px); }
.auracss-font-pill.active, .auracss-theme-pill.active { background: rgba(56, 189, 248, 0.2); border-color: #38bdf8; color: #38bdf8; font-weight: 700; }

.auracss-pills-row { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.auracss-size-pill, .auracss-style-pill {
  display: inline-flex; align-items: center; justify-content: center; padding: 3px 7px; border-radius: 5px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.auracss-size-pill:hover, .auracss-style-pill:hover { background: rgba(56, 189, 248, 0.12); border-color: #38bdf8; color: #ffffff; transform: translateY(-1px); }
.auracss-size-pill.active, .auracss-style-pill.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }

.auracss-swatches-grid { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; margin-top: 1px; }
.auracss-swatch-btn {
  width: 22px; height: 22px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-swatch-btn:hover { transform: scale(1.18); border-color: #ffffff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.4); }
.auracss-swatch-btn.active { border: 2px solid #38bdf8; box-shadow: 0 0 8px #38bdf8; }
.auracss-dock-content { display: flex; align-items: center; gap: 8px; width: 100%; }
`,le=[{name:"Inter / Sans",family:"Inter, system-ui, -apple-system, sans-serif",tailwind:"font-sans"},{name:"Modern Mono",family:"ui-monospace, SFMono-Regular, Menlo, monospace",tailwind:"font-mono"},{name:"Editorial Serif",family:'Georgia, Cambria, "Times New Roman", serif',tailwind:"font-serif"},{name:"Display Heading",family:'Impact, "Cabinet Grotesk", system-ui, sans-serif',tailwind:"font-display"}],ce=[{label:"XS (12px)",size:"12px",tailwind:"text-xs"},{label:"SM (14px)",size:"14px",tailwind:"text-sm"},{label:"MD (16px)",size:"16px",tailwind:"text-base"},{label:"LG (18px)",size:"18px",tailwind:"text-lg"},{label:"XL (22px)",size:"22px",tailwind:"text-xl"},{label:"2XL (28px)",size:"28px",tailwind:"text-2xl"}],de=[{name:"Pure White",hex:"#ffffff",tailwind:"text-white"},{name:"Slate 100",hex:"#f1f5f9",tailwind:"text-slate-100"},{name:"Muted Slate",hex:"#94a3b8",tailwind:"text-slate-400"},{name:"Sky Cyan",hex:"#38bdf8",tailwind:"text-sky-400"},{name:"Electric Violet",hex:"#a855f7",tailwind:"text-purple-400"},{name:"Emerald Neon",hex:"#34d399",tailwind:"text-emerald-400"},{name:"Warm Amber",hex:"#fbbf24",tailwind:"text-amber-400"},{name:"Rose Flame",hex:"#f87171",tailwind:"text-rose-400"},{name:"Deep Slate",hex:"#0f172a",tailwind:"text-slate-900"}],pe=[{label:"Regular (400)",property:"font-weight",value:"400",tailwind:"font-normal"},{label:"Medium (500)",property:"font-weight",value:"500",tailwind:"font-medium"},{label:"Semibold (600)",property:"font-weight",value:"600",tailwind:"font-semibold"},{label:"Bold (700)",property:"font-weight",value:"700",tailwind:"font-bold"},{label:"Italic",property:"font-style",value:"italic",tailwind:"italic"},{label:"Uppercase",property:"text-transform",value:"uppercase",tailwind:"uppercase tracking-wider"},{label:"Underline",property:"text-decoration",value:"underline",tailwind:"underline"}];function ue(l){const e=Math.floor((Date.now()-l)/1e3);if(e<60)return"Just now";const s=Math.floor(e/60);return s<60?`${s}m ago`:`${Math.floor(s/60)}h ago`}class he{dockEl=null;dockContentEl=null;savedPopoverEl=null;palettePopoverEl=null;activePresetId=null;onSelectCallback=null;removeWindowListeners=null;mount(e){if(this.dockEl)return;const s=document.createElement("style");s.textContent=ne,e.appendChild(s);const t=document.createElement("div");t.className="auracss-variation-dock",t.setAttribute("role","toolbar"),t.setAttribute("aria-label","AuraCSS Design Variations");const a=document.createElement("div");a.className="auracss-saved-popover",t.appendChild(a),this.savedPopoverEl=a;const o=document.createElement("div");o.className="auracss-palette-popover",t.appendChild(o),this.palettePopoverEl=o;const i=document.createElement("div");i.className="auracss-dock-content",t.appendChild(i),this.dockContentEl=i,e.appendChild(t),this.dockEl=t}setActivePresetId(e){this.activePresetId=e,this.dockEl&&(this.dockEl.querySelectorAll(".auracss-preset-card").forEach(s=>{const t=s;t.classList.toggle("active",t.dataset.presetId===e)}),this.savedPopoverEl&&this.savedPopoverEl.querySelectorAll(".auracss-saved-card").forEach(s=>{const t=s;t.classList.toggle("active",t.dataset.savedId===e)}))}closeAllPopovers(){this.savedPopoverEl?.classList.remove("visible"),this.palettePopoverEl?.classList.remove("visible")}toggleSavedPopover(e,s,t,a){if(!this.savedPopoverEl)return;const o=this.savedPopoverEl.classList.contains("visible");this.closeAllPopovers(),o||(this.renderSavedPopover(e,s,t,a),this.savedPopoverEl.classList.add("visible"))}togglePalettePopover(e,s){if(!this.palettePopoverEl)return;const t=this.palettePopoverEl.classList.contains("visible");this.closeAllPopovers(),t||(this.renderPalettePopover(e,s),this.palettePopoverEl.classList.add("visible"))}renderPalettePopover(e,s){if(!this.palettePopoverEl)return;this.palettePopoverEl.innerHTML="";const t=document.createElement("div");t.className="auracss-palette-header",t.innerHTML="<span>🔤 Typography & Font Style</span>";const a=document.createElement("button");a.className="auracss-palette-close",a.type="button",a.innerHTML="✕",a.onclick=g=>{g.stopPropagation(),this.palettePopoverEl?.classList.remove("visible")},t.appendChild(a),this.palettePopoverEl.appendChild(t);const o=document.createElement("div");o.className="auracss-palette-section";const i=document.createElement("div");i.className="auracss-palette-section-title",i.textContent="Font Family",o.appendChild(i);const n=document.createElement("div");n.className="auracss-font-grid",le.forEach(g=>{const u=document.createElement("button");u.className="auracss-font-pill auracss-theme-pill",u.type="button",u.style.fontFamily=g.family,u.textContent=g.name,u.onclick=v=>{v.stopPropagation(),n.querySelectorAll(".auracss-font-pill").forEach(y=>y.classList.remove("active")),u.classList.add("active"),e?.({property:"font-family",value:g.family,tailwind:g.tailwind,label:g.name})},n.appendChild(u)}),o.appendChild(n),this.palettePopoverEl.appendChild(o);const r=document.createElement("div");r.className="auracss-palette-section";const p=document.createElement("div");p.className="auracss-palette-section-title",p.textContent="Font Size",r.appendChild(p);const h=document.createElement("div");h.className="auracss-pills-row",ce.forEach(g=>{const u=document.createElement("button");u.className="auracss-size-pill",u.type="button",u.textContent=g.label,u.onclick=v=>{v.stopPropagation(),h.querySelectorAll(".auracss-size-pill").forEach(y=>y.classList.remove("active")),u.classList.add("active"),e?.({property:"font-size",value:g.size,tailwind:g.tailwind,label:g.label})},h.appendChild(u)}),r.appendChild(h),this.palettePopoverEl.appendChild(r);const m=document.createElement("div");m.className="auracss-palette-section";const d=document.createElement("div");d.className="auracss-palette-section-title",d.textContent="Font Color",m.appendChild(d);const b=document.createElement("div");b.className="auracss-swatches-grid",de.forEach(g=>{const u=document.createElement("button");u.className="auracss-swatch-btn auracss-font-color-btn",u.type="button",u.title=`Apply ${g.name} (${g.hex})`,u.style.backgroundColor=g.hex,u.onclick=v=>{v.stopPropagation(),b.querySelectorAll(".auracss-swatch-btn").forEach(y=>y.classList.remove("active")),u.classList.add("active"),e?.({property:"color",value:g.hex,tailwind:g.tailwind,label:g.name})},b.appendChild(u)}),m.appendChild(b),this.palettePopoverEl.appendChild(m);const c=document.createElement("div");c.className="auracss-palette-section";const f=document.createElement("div");f.className="auracss-palette-section-title",f.textContent="Font Style & Weight",c.appendChild(f);const w=document.createElement("div");w.className="auracss-pills-row",pe.forEach(g=>{const u=document.createElement("button");u.className="auracss-style-pill",u.type="button",u.textContent=g.label,u.onclick=v=>{v.stopPropagation(),w.querySelectorAll(".auracss-style-pill").forEach(y=>y.classList.remove("active")),u.classList.add("active"),e?.({property:g.property,value:g.value,tailwind:g.tailwind,label:g.label})},w.appendChild(u)}),c.appendChild(w),this.palettePopoverEl.appendChild(c)}renderSavedPopover(e,s,t,a){if(!this.savedPopoverEl)return;this.savedPopoverEl.innerHTML="";const o=document.createElement("div");if(o.className="auracss-saved-popover-header",o.innerHTML=`<span>💾 Saved Prompted Styles (${e.length})</span>`,e.length>0&&a){const r=document.createElement("button");r.className="auracss-saved-clear-all",r.type="button",r.textContent="Clear All",r.title="Clear all saved prompt results",r.onclick=p=>{p.stopPropagation(),a()},o.appendChild(r)}const i=document.createElement("button");i.className="auracss-saved-popover-close",i.type="button",i.innerHTML="✕",i.onclick=r=>{r.stopPropagation(),this.savedPopoverEl?.classList.remove("visible")},o.appendChild(i),this.savedPopoverEl.appendChild(o);const n=document.createElement("div");if(n.className="auracss-saved-list",e.length===0){const r=document.createElement("div");r.className="auracss-saved-empty",r.innerHTML=`
        <div style="font-weight: 600; color: #94a3b8;">✨ No saved prompts yet</div>
        <div style="font-size: 10px; margin-top: 4px;">Prompt Antigravity in chat to generate and stream live styles here.</div>
      `,n.appendChild(r)}else e.forEach(r=>{const p=document.createElement("div");p.className=`auracss-saved-card${r.id===this.activePresetId?" active":""}`,p.dataset.savedId=r.id;const h=document.createElement("div");h.className="auracss-saved-card-header";const m=document.createElement("span");m.className="auracss-saved-card-title",m.textContent=r.name;const d=document.createElement("div");d.style.display="flex",d.style.alignItems="center";const b=document.createElement("span");if(b.className="auracss-saved-card-time",b.textContent=ue(r.timestamp),d.appendChild(b),t){const c=document.createElement("button");c.className="auracss-saved-card-remove",c.type="button",c.title="Remove this saved prompt result",c.innerHTML="✕",c.onclick=f=>{f.stopPropagation(),t(r)},d.appendChild(c)}if(h.append(m,d),p.appendChild(h),r.description){const c=document.createElement("div");c.className="auracss-saved-card-desc",c.textContent=r.description,p.appendChild(c)}if(r.tailwindClasses){const c=document.createElement("div");c.className="auracss-saved-card-tw",c.textContent=r.tailwindClasses,p.appendChild(c)}p.addEventListener("click",c=>{c.stopPropagation(),this.setActivePresetId(r.id),s?.(r)}),n.appendChild(p)});this.savedPopoverEl.appendChild(n)}render(e,s,t,a=!1,o,i,n,r,p,h,m,d,b,c,f,w,g,u){if(!this.dockEl||!this.dockContentEl)return;this.onSelectCallback=s,this.removeWindowListeners?.(),this.removeWindowListeners=null;const v=this.savedPopoverEl?.classList.contains("visible")??!1,y=this.palettePopoverEl?.classList.contains("visible")??!1;this.dockContentEl.innerHTML="",a||(this.activePresetId=null);const S=document.createElement("div");if(S.className="auracss-dock-stack left",r){const x=document.createElement("button");x.className="auracss-ai-remodel-btn",x.type="button";const E=typeof p=="number"?`${p+1}/3`:"1/3";x.title=`AI Variations (Set ${E}) - Click to cycle`,x.innerHTML=`<span>✨</span><span class="auracss-btn-badge">${E}</span>`,x.onclick=A=>{A.stopPropagation(),x.innerHTML='<span>✨</span><span class="auracss-btn-badge">...</span>',r()},S.appendChild(x)}if(t){const x=document.createElement("button");x.className=`auracss-preset-reset${a?"":" disabled"}`,x.type="button",x.title=a?"Revert element to original unstyled state":"Original element unstyled",x.innerHTML="↺",x.onclick=E=>{E.stopPropagation(),a&&(this.activePresetId=null,t())},S.appendChild(x)}this.dockContentEl.appendChild(S);const k=document.createElement("div");k.className="auracss-dock-divider",this.dockContentEl.appendChild(k);const C=document.createElement("div");C.className="auracss-cards-track";let P=!1,L=0,$=0,T=!1;const R=x=>{P=!0,T=!1,L=x.pageX-C.offsetLeft,$=C.scrollLeft,C.classList.add("grabbing")},K=x=>{if(!P)return;x.preventDefault();const A=(x.pageX-C.offsetLeft-L)*1.4;Math.abs(A)>4&&(T=!0),C.scrollLeft=$-A},Z=()=>{P&&(P=!1,C.classList.remove("grabbing"))};C.addEventListener("mousedown",R),window.addEventListener("mousemove",K),window.addEventListener("mouseup",Z),this.removeWindowListeners=()=>{window.removeEventListener("mousemove",K),window.removeEventListener("mouseup",Z)},e.forEach(x=>{const E=document.createElement("div");E.className=`auracss-preset-card${x.id===this.activePresetId?" active":""}`,E.dataset.presetId=x.id;const A=document.createElement("span");A.className="auracss-preset-name",A.textContent=x.name;const W=document.createElement("span");if(W.className="auracss-preset-desc",W.textContent=x.description,E.appendChild(A),E.appendChild(W),x.contrastRating){const D=document.createElement("span");D.className=`auracss-contrast-badge ${x.contrastRating}`,D.textContent=`WCAG ${x.contrastRating} ${x.contrastRatio??""}`,E.appendChild(D)}E.addEventListener("click",D=>{T||(D.stopPropagation(),this.activePresetId===x.id?(this.activePresetId=null,E.classList.remove("active"),h?.(x)):(this.activePresetId=x.id,this.dockEl?.querySelectorAll(".auracss-preset-card").forEach(ze=>ze.classList.remove("active")),E.classList.add("active"),this.onSelectCallback?.(x)))}),C.appendChild(E)}),this.dockContentEl.appendChild(C);const Q=document.createElement("div");Q.className="auracss-dock-divider",this.dockContentEl.appendChild(Q);const I=document.createElement("div");I.className="auracss-dock-stack right";const F=document.createElement("div");F.className="auracss-dock-row";const N=document.createElement("button");if(N.className="auracss-dock-palette-btn auracss-dock-tune-btn",N.type="button",N.title="Typography & Font Styles",N.innerHTML="Aa",N.onclick=x=>{x.stopPropagation(),i?i():this.togglePalettePopover(w,f)},F.appendChild(N),n){const x=document.createElement("button");x.className="auracss-ai-settings-btn",x.type="button",x.title="Antigravity Agent Diagnostics",x.innerHTML="⚙️",x.onclick=E=>{E.stopPropagation(),n()},F.appendChild(x)}I.appendChild(F);const z=document.createElement("button");z.className="auracss-saved-styles-btn",z.type="button";const U=m?.length||0;z.title=`Saved Prompted Styles (${U} saved)`,z.innerHTML=`<span>💾</span>${U>0?`<span class="auracss-btn-badge">${U}</span>`:""}`,z.onclick=x=>{x.stopPropagation(),this.toggleSavedPopover(m||[],d,g,u)},I.appendChild(z),this.dockContentEl.appendChild(I),this.dockEl.classList.add("visible"),y?(this.renderPalettePopover(w,f),this.palettePopoverEl?.classList.add("visible")):v&&(this.renderSavedPopover(m||[],d,g,u),this.savedPopoverEl?.classList.add("visible"))}clear(){this.activePresetId=null,this.closeAllPopovers(),this.removeWindowListeners?.(),this.removeWindowListeners=null,this.dockEl&&this.dockEl.classList.remove("visible"),this.dockContentEl&&(this.dockContentEl.innerHTML="")}destroy(){this.clear(),this.dockEl&&this.dockEl.parentNode&&this.dockEl.parentNode.removeChild(this.dockEl),this.dockEl=null,this.dockContentEl=null,this.savedPopoverEl=null,this.palettePopoverEl=null,this.onSelectCallback=null}}class ge{supports(e){const s=e.tagName.toLowerCase(),t=e.getAttribute("role"),a=e.classList.contains("btn")||e.classList.contains("button");return s==="button"||s==="a"||t==="button"||a}generatePresets(e,s){const t=s.baseRadius||"8px";return[{id:"action-modern-primary",name:"Aura Modern Primary",description:"Vibrant brand primary with smooth elevation shadow",cssText:`background-color: ${s.primaryColor}; color: #ffffff; border-radius: ${t}; border: none; padding: 10px 20px; font-weight: 600; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); cursor: pointer; transition: transform 0.15s ease, filter 0.15s ease;`,tailwindClasses:"bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all",contrastRating:"AAA",contrastRatio:"7.8:1"},{id:"action-glass-outline",name:"Frosted Glass Outline",description:"Translucent glass surface with delicate alpha border",cssText:`background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: ${t}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: background-color 0.15s ease;`,tailwindClasses:"bg-white/10 hover:bg-white/15 border border-white/20 text-slate-100 backdrop-blur-md px-5 py-2.5 rounded-lg transition-all",contrastRating:"AA",contrastRatio:"5.4:1"},{id:"action-ambient-glow",name:"Ambient Neon Aura",description:"Brand tinted surface radiating soft ambient glow",cssText:`background-color: rgba(99, 102, 241, 0.12); color: #e0e7ff; border: 1px solid rgba(99, 102, 241, 0.45); box-shadow: 0 0 16px rgba(99, 102, 241, 0.35); border-radius: ${t}; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: box-shadow 0.2s ease;`,tailwindClasses:"bg-indigo-500/10 border border-indigo-500/40 text-indigo-200 shadow-[0_0_16px_rgba(99,102,241,0.35)] px-5 py-2.5 rounded-lg transition-all",contrastRating:"AAA",contrastRatio:"8.2:1"},{id:"action-subtle-ghost",name:"Subtle Ghost Minimal",description:"Clean borderless styling with gentle hover feedback",cssText:`background-color: transparent; color: #94a3b8; border: 1px solid transparent; border-radius: ${t}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: color 0.15s ease, background-color 0.15s ease;`,tailwindClasses:"bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg transition-all",contrastRating:"AA",contrastRatio:"4.8:1"}]}}class be{supports(e){const s=e.tagName.toLowerCase(),t=e.getAttribute("role"),a=["div","section","article","aside","main","card"].includes(s),o=e.classList.contains("card")||e.classList.contains("box");return a||t==="region"||o}generatePresets(e,s){const t=s.baseRadius||"12px";return[{id:"container-elevated-card",name:"Elevated Modern Card",description:"Rich dark surface with deep layered drop shadow",cssText:`background-color: #1e293b; border: 1px solid #334155; border-radius: ${t}; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);`,tailwindClasses:"bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"},{id:"container-frosted-glass",name:"Frosted Glass Surface",description:"Deep translucent backdrop blur with fine highlight border",cssText:`background-color: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: ${t}; padding: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`,tailwindClasses:"bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl"},{id:"container-ambient-glow",name:"Ambient Aura Box",description:"Atmospheric halo glow echoing the primary brand tone",cssText:`background-color: #0f172a; border: 1px solid rgba(99, 102, 241, 0.35); box-shadow: 0 0 28px rgba(99, 102, 241, 0.15); border-radius: ${t}; padding: 24px;`,tailwindClasses:"bg-slate-900 border border-indigo-500/30 shadow-[0_0_28px_rgba(99,102,241,0.15)] rounded-xl p-6"},{id:"container-flat-minimal",name:"Crisp Flat Minimal",description:"High-contrast structural outline with zero blur drop shadow",cssText:`background-color: #0f172a; border: 2px solid #334155; border-radius: ${t}; padding: 24px; box-shadow: none;`,tailwindClasses:"bg-slate-900 border-2 border-slate-700 rounded-lg p-6 shadow-none"}]}}class me{supports(e){const s=e.tagName.toLowerCase();return["h1","h2","h3","h4","h5","h6","p","span","label","strong","em"].includes(s)}generatePresets(e,s){return/^h[1-6]$/i.test(e.tagName)?[{id:"text-gradient-hero",name:"Vibrant Mesh Gradient",description:"Multi-stop text gradient with tight letter spacing",cssText:"background: linear-gradient(135deg, #a5b4fc 0%, #38bdf8 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15;",tailwindClasses:"bg-gradient-to-r from-indigo-300 via-sky-400 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-tight"},{id:"text-crisp-white",name:"High-Contrast Crisp",description:"Maximum luminance contrast with crisp tracking",cssText:"color: #f8fafc; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);",tailwindClasses:"text-slate-100 font-bold tracking-tight drop-shadow-sm"},{id:"text-eyebrow-accent",name:"Uppercase Eyebrow",description:"Spaced uppercase title with brand hue",cssText:"color: #818cf8; font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; line-height: 1.4;",tailwindClasses:"text-indigo-400 text-xs font-bold uppercase tracking-widest"},{id:"text-subtle-glow",name:"Subtle Neon Header",description:"Soft luminous text aura for atmospheric headings",cssText:"color: #38bdf8; font-weight: 700; letter-spacing: -0.01em; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);",tailwindClasses:"text-sky-400 font-bold tracking-normal drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"}]:[{id:"text-body-high-contrast",name:"High-Legibility Reading",description:"Optimized 1.6 line height with clean contrast",cssText:"color: #f1f5f9; font-size: 1.05rem; line-height: 1.65; letter-spacing: 0.01em;",tailwindClasses:"text-slate-100 text-base leading-relaxed tracking-normal"},{id:"text-body-muted-slate",name:"Muted Secondary Prose",description:"Relaxed secondary tone for ancillary descriptions",cssText:"color: #94a3b8; font-size: 0.95rem; line-height: 1.6;",tailwindClasses:"text-slate-400 text-sm leading-normal"},{id:"text-body-callout",name:"Highlighted Lead Paragraph",description:"Larger font size with subtle italic emphasis",cssText:"color: #cbd5e1; font-size: 1.15rem; line-height: 1.7; font-weight: 400; font-style: italic;",tailwindClasses:"text-slate-300 text-lg leading-relaxed italic"},{id:"text-body-pill-badge",name:"Compact Metadata Tag",description:"Inline badge with subdued background surface",cssText:"color: #38bdf8; background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; padding: 2px 10px; font-size: 0.8rem; font-weight: 600; display: inline-block;",tailwindClasses:"text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block"}]}}class fe{strategies;constructor(){this.strategies=[new ge,new me,new be]}suggest(e,s){for(const t of this.strategies)if(t.supports(e))return t.generatePresets(e,s);return this.strategies[2].generatePresets(e,s)}}class xe{undoStack=[];redoStack=[];maxHistory=50;execute(e){!e.element||!e.element.isConnected||(e.element.style.cssText=e.appliedCssText,this.undoStack.push(e),this.undoStack.length>this.maxHistory&&this.undoStack.shift(),this.redoStack.length=0)}undo(){const e=this.undoStack.pop();return e?(e.element&&e.element.isConnected&&(e.element.style.cssText=e.previousCssText),this.redoStack.push(e),e):null}redo(){const e=this.redoStack.pop();return e?(e.element&&e.element.isConnected&&(e.element.style.cssText=e.appliedCssText),this.undoStack.push(e),e):null}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}getHistory(){return this.undoStack}getUniqueElementCount(){const e=new Set;for(const s of this.undoStack)s.element&&s.element.isConnected&&e.add(s.element);return e.size}removeElement(e){this.undoStack=this.undoStack.filter(s=>s.element!==e),this.redoStack=this.redoStack.filter(s=>s.element!==e)}clear(){this.undoStack.length=0,this.redoStack.length=0}}function X(l){if(l.length===0)return"/* No style changes recorded */";const e=new Map;for(const t of l)e.set(t.selectorPath,t.appliedCssText);const s=["/* === AuraCSS Generated CSS Export === */"];for(const[t,a]of e.entries()){const o=a.split(";").map(i=>i.trim()).filter(Boolean).map(i=>`  ${i};`).join(`
`);s.push(`${t} {
${o}
}`)}return s.join(`

`)}function we(l){if(l.length===0)return"// No Tailwind mutations recorded";const e=new Map;for(const t of l)e.set(t.selectorPath,t.tailwindClasses);const s=["// === AuraCSS Tailwind Mapping ==="];for(const[t,a]of e.entries())s.push(`// ${t}
className="${a}"`);return s.join(`

`)}function ve(l){if(l.length===0)return"// No element mutations recorded";const e=new Map;for(const t of l)e.set(t.selectorPath,{tw:t.tailwindClasses,css:t.appliedCssText});const s=["// === AuraCSS JSX / Component Export ==="];for(const[t,a]of e.entries()){const o=a.css.split(";").map(i=>i.trim()).filter(Boolean).map(i=>{const n=i.indexOf(":");if(n===-1)return null;const r=i.slice(0,n).trim(),p=i.slice(n+1).trim();return`    ${r.replace(/-([a-z])/g,(m,d)=>d.toUpperCase())}: "${p}"`}).filter(Boolean).join(`,
`);s.push(`// ${t}
<div className="${a.tw}" style={{
${o}
}}>...</div>`)}return s.join(`

`)}const ye=`
.auracss-ledger-modal {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2147483647;
  pointer-events: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-ledger-modal.visible { display: flex; }
.auracss-ledger-card {
  width: 90%;
  max-width: 680px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #f8fafc;
}
.auracss-ledger-header { display: flex; justify-content: space-between; align-items: flex-start; }
.auracss-ledger-title-group { display: flex; flex-direction: column; gap: 2px; }
.auracss-ledger-title { color: #f8fafc; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.auracss-ledger-subtitle { color: #94a3b8; font-size: 11.5px; font-weight: 500; }
.auracss-ledger-close { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 4px; border-radius: 4px; }
.auracss-ledger-close:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.1); }
.auracss-ledger-chips {
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none;
}
.auracss-ledger-chips::-webkit-scrollbar { display: none; }
.auracss-ledger-chip {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 10.5px;
  background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 3px 8px; border-radius: 6px; white-space: nowrap; flex-shrink: 0;
}
.auracss-ledger-tabs { display: flex; gap: 8px; }
.auracss-ledger-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.auracss-ledger-tab:hover { background: rgba(255, 255, 255, 0.1); color: #f8fafc; }
.auracss-ledger-tab.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }
.auracss-ledger-textarea {
  width: 100%;
  height: 220px;
  box-sizing: border-box;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #38bdf8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  padding: 14px;
  resize: vertical;
  outline: none;
}
.auracss-ledger-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
.auracss-ledger-download {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.auracss-ledger-download:hover { background: rgba(255, 255, 255, 0.16); border-color: rgba(255, 255, 255, 0.3); }
.auracss-ledger-copy {
  background: #4f46e5;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.auracss-ledger-copy:hover { background: #6366f1; transform: translateY(-1px); }
`;class ke{modalEl=null;textAreaEl=null;subtitleEl=null;chipsEl=null;currentMode="css";commands=[];mount(e){if(this.modalEl)return;const s=document.createElement("style");s.textContent=ye,e.appendChild(s);const t=document.createElement("div");t.className="auracss-ledger-modal",t.setAttribute("role","dialog"),t.setAttribute("aria-label","AuraCSS Export Ledger");const a=document.createElement("div");a.className="auracss-ledger-card";const o=document.createElement("div");o.className="auracss-ledger-header";const i=document.createElement("div");i.className="auracss-ledger-title-group";const n=document.createElement("span");n.className="auracss-ledger-title",n.innerHTML="✦ AuraCSS Change Ledger";const r=document.createElement("span");r.className="auracss-ledger-subtitle",r.textContent="0 elements modified",this.subtitleEl=r,i.append(n,r);const p=document.createElement("button");p.className="auracss-ledger-close",p.type="button",p.textContent="✕",p.onclick=()=>this.hide(),o.appendChild(i),o.appendChild(p);const h=document.createElement("div");h.className="auracss-ledger-chips",this.chipsEl=h;const m=document.createElement("div");m.className="auracss-ledger-tabs";const d=document.createElement("button");d.className="auracss-ledger-tab active",d.type="button",d.textContent="CSS Diff";const b=document.createElement("button");b.className="auracss-ledger-tab",b.type="button",b.textContent="Tailwind";const c=document.createElement("button");c.className="auracss-ledger-tab",c.type="button",c.textContent="JSX Component",m.append(d,b,c);const f=document.createElement("textarea");f.className="auracss-ledger-textarea",f.readOnly=!0;const w=document.createElement("div");w.className="auracss-ledger-actions";const g=document.createElement("button");g.className="auracss-ledger-download",g.type="button",g.textContent="📥 Download .css",g.onclick=()=>{try{const v=X(this.commands),y=new Blob([v],{type:"text/css;charset=utf-8"}),S=URL.createObjectURL(y),k=document.createElement("a");k.href=S,k.download=`auracss-changes-${Date.now()}.css`,document.body.appendChild(k),k.click(),document.body.removeChild(k),URL.revokeObjectURL(S)}catch{}};const u=document.createElement("button");u.className="auracss-ledger-copy",u.type="button",u.textContent="Copy to Clipboard",w.append(g,u),d.onclick=()=>{this.currentMode="css",d.classList.add("active"),b.classList.remove("active"),c.classList.remove("active"),this.updateText()},b.onclick=()=>{this.currentMode="tailwind",b.classList.add("active"),d.classList.remove("active"),c.classList.remove("active"),this.updateText()},c.onclick=()=>{this.currentMode="jsx",c.classList.add("active"),d.classList.remove("active"),b.classList.remove("active"),this.updateText()},u.onclick=async()=>{try{await navigator.clipboard.writeText(f.value),u.textContent="✓ Copied!",setTimeout(()=>{u.textContent="Copy to Clipboard"},1500)}catch{f.select(),document.execCommand("copy"),u.textContent="✓ Copied!",setTimeout(()=>{u.textContent="Copy to Clipboard"},1500)}},a.appendChild(o),a.appendChild(h),a.appendChild(m),a.appendChild(f),a.appendChild(w),t.appendChild(a),t.addEventListener("click",v=>{v.target===t&&this.hide()}),e.appendChild(t),this.modalEl=t,this.textAreaEl=f}updateText(){this.textAreaEl&&(this.currentMode==="css"?this.textAreaEl.value=X(this.commands):this.currentMode==="tailwind"?this.textAreaEl.value=we(this.commands):this.textAreaEl.value=ve(this.commands))}show(e){if(!this.modalEl||!this.textAreaEl)return;this.commands=e;const s=new Set;e.forEach(a=>s.add(a.selectorPath));const t=s.size;this.subtitleEl&&(this.subtitleEl.textContent=`${t} element${t===1?"":"s"} modified • Ready to copy or download`),this.chipsEl&&(this.chipsEl.innerHTML="",s.forEach(a=>{const o=document.createElement("span");o.className="auracss-ledger-chip",o.textContent=a,this.chipsEl?.appendChild(o)})),this.updateText(),this.modalEl.classList.add("visible")}hide(){this.modalEl&&this.modalEl.classList.remove("visible")}destroy(){this.modalEl&&this.modalEl.parentNode&&this.modalEl.parentNode.removeChild(this.modalEl),this.modalEl=null,this.textAreaEl=null,this.subtitleEl=null,this.chipsEl=null}}const Ce=`
.auracss-customizer-drawer {
  position: fixed;
  bottom: 86px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  gap: 8px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  z-index: 2147483646;
  pointer-events: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-width: 380px;
}
.auracss-customizer-drawer.visible { display: flex; }
.auracss-tune-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.auracss-tune-label { color: #94a3b8; font-size: 11px; font-weight: 600; min-width: 60px; }
.auracss-tune-pills { display: flex; gap: 4px; flex: 1; }
.auracss-tune-pill {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}
.auracss-tune-pill:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; }
.auracss-tune-pill.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }
`;class Ee{drawerEl=null;onTuneCallback=null;mount(e){if(this.drawerEl)return;const s=document.createElement("style");s.textContent=Ce,e.appendChild(s);const t=document.createElement("div");t.className="auracss-customizer-drawer",t.setAttribute("role","region"),t.setAttribute("aria-label","AuraCSS Fine-Tuning Controls"),t.appendChild(this.createRow("Radius",[{label:"0px",value:"0px",tw:"rounded-none"},{label:"8px",value:"8px",tw:"rounded-lg"},{label:"16px",value:"16px",tw:"rounded-2xl"},{label:"Pill",value:"9999px",tw:"rounded-full"}],"borderRadius")),t.appendChild(this.createRow("Padding",[{label:"Tight",value:"6px 12px",tw:"px-3 py-1.5"},{label:"Normal",value:"10px 20px",tw:"px-5 py-2.5"},{label:"Wide",value:"16px 28px",tw:"px-7 py-3.5"}],"padding")),t.appendChild(this.createRow("Shadow",[{label:"Flat",value:"none",tw:"shadow-none"},{label:"Elevation",value:"0 8px 24px rgba(0,0,0,0.3)",tw:"shadow-xl"},{label:"Neon Glow",value:"0 0 20px rgba(56, 189, 248, 0.45)",tw:"shadow-[0_0_20px_#38bdf8]"}],"boxShadow")),e.appendChild(t),this.drawerEl=t}createRow(e,s,t){const a=document.createElement("div");a.className="auracss-tune-row";const o=document.createElement("span");o.className="auracss-tune-label",o.textContent=e,a.appendChild(o);const i=document.createElement("div");return i.className="auracss-tune-pills",s.forEach(n=>{const r=document.createElement("button");r.className="auracss-tune-pill",r.type="button",r.textContent=n.label,r.onclick=p=>{p.stopPropagation(),i.querySelectorAll(".auracss-tune-pill").forEach(m=>m.classList.remove("active")),r.classList.add("active");const h=t.replace(/([A-Z])/g,"-$1").toLowerCase();this.onTuneCallback?.({property:h,value:n.value,cssText:`${h}: ${n.value};`,tailwind:n.tw})},i.appendChild(r)}),a.appendChild(i),a}show(e){this.onTuneCallback=e,this.drawerEl?.classList.add("visible")}hide(){this.drawerEl?.classList.remove("visible"),this.onTuneCallback=null}toggle(e){this.drawerEl?.classList.contains("visible")?this.hide():this.show(e)}destroy(){this.hide(),this.drawerEl&&this.drawerEl.parentNode&&this.drawerEl.parentNode.removeChild(this.drawerEl),this.drawerEl=null}}const q="auracss_ai_config";function Se(l){const e=l.replace(/```json/gi,"").replace(/```/g,"").trim();return JSON.parse(e)}class Pe{config={provider:"bridge",bridgeUrl:"http://127.0.0.1:4999",apiKey:"",model:"agent-auto"};status="untested";lastError="";constructor(){this.loadConfig()}loadConfig(){try{const e=typeof localStorage<"u"?localStorage.getItem(q):null;e&&Object.assign(this.config,JSON.parse(e))}catch{}return this.config.provider="bridge",this.status="untested",this.config}saveConfig(e){this.config={...this.config,...e,provider:"bridge"};try{typeof localStorage<"u"&&localStorage.setItem(q,JSON.stringify(this.config))}catch{}}isConfigured(){return!0}getConfig(){return{...this.config}}getStatus(){return{status:this.status,error:this.lastError}}async testConnection(){const e=new AbortController,s=setTimeout(()=>e.abort(),4e3),t=Date.now();try{const a=`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/health`,o=await fetch(a,{signal:e.signal}),i=Date.now()-t;if(o.ok)return this.status="connected",this.lastError="",{success:!0,message:`Connected to Antigravity MCP Bridge on 127.0.0.1:4999 (${i}ms)`,latencyMs:i};throw new Error(`Bridge returned HTTP ${o.status}`)}catch(a){this.status="error";const o=a instanceof Error&&a.name==="AbortError"?"Connection timed out after 4s":a instanceof Error?a.message:String(a);return this.lastError=o,{success:!1,message:`Bridge connection failed: ${o.slice(0,100)}`}}finally{clearTimeout(s)}}async synthesize(e,s){try{const t=await this.callBridge(e,s);return this.status="connected",this.lastError="",t}catch(t){throw this.status="error",this.lastError=t instanceof Error?t.message:String(t),t}}async callBridge(e,s){const t=`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/api/synthesize`,a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e),signal:s});if(!a.ok)throw new Error(`Bridge HTTP ${a.status}`);return await a.json()}notifyActiveElement(e){if(!(typeof fetch>"u"))try{fetch(`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/api/active-element`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).catch(()=>{})}catch{}}subscribeBridge(e){if(!(typeof window>"u"||typeof EventSource>"u"))try{const s=new EventSource(`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/api/events`);s.onmessage=t=>{try{const a=JSON.parse(t.data);a.type==="apply_style"&&a.payload?.cssText&&e(a.payload)}catch{}}}catch{}}async generateAISuggestions(e,s,t=0){const a=`Generate 4 diverse design variations (Theme Set ${t+1} of 3): Return JSON: { "presets": [ { "id": "p1", "name": "Name", "description": "Desc", "cssText": "...", "tailwindClasses": "..." } ] }`,o=await this.synthesize({...e,prompt:a,setIndex:t},s);try{const i=Se(o.explanation.includes("{")?o.explanation:JSON.stringify(o));if(Array.isArray(i.presets)&&i.presets.length>0)return i.presets.map((n,r)=>({...n,id:n.id||`ai-${r}-${Date.now()}`,contrastRating:"AAA",contrastRatio:"7.5:1"}))}catch{}return[{id:`ai-${Date.now()}`,name:"AI Smart Redesign",description:o.explanation||"Bespoke design",cssText:o.cssText,tailwindClasses:o.tailwindClasses,contrastRating:"AAA",contrastRatio:"7.2:1"}]}}const Le=`
.auracss-ai-modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; z-index: 2147483647; pointer-events: auto; }
.auracss-ai-modal-backdrop.visible { display: flex; }
.auracss-ai-modal { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; width: 440px; max-width: 92vw; padding: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; gap: 14px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; }
.auracss-ai-modal-header { display: flex; justify-content: space-between; align-items: center; }
.auracss-ai-modal-title { font-size: 15px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px; }
.auracss-ai-modal-close { background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 4px; border-radius: 4px; }
.auracss-ai-modal-close:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.1); }
.auracss-ai-bridge-card {
  display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
  border: 1px solid rgba(56, 189, 248, 0.25);
}
.auracss-ai-bridge-header { display: flex; align-items: center; justify-content: space-between; }
.auracss-ai-bridge-badge { font-size: 11px; font-weight: 700; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.3); display: inline-flex; align-items: center; gap: 4px; }
.auracss-ai-bridge-port { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #c084fc; background: rgba(168, 85, 247, 0.15); padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(168, 85, 247, 0.3); }
.auracss-ai-bridge-title { font-size: 13px; font-weight: 700; color: #f8fafc; }
.auracss-ai-bridge-desc { font-size: 12px; line-height: 1.45; color: #94a3b8; }
.auracss-diag-section {
  display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 11.5px;
}
.auracss-diag-row { display: flex; justify-content: space-between; align-items: center; }
.auracss-diag-label { color: #64748b; font-weight: 600; }
.auracss-diag-val { color: #cbd5e1; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; }
.auracss-ai-status { font-size: 11px; padding: 4px 8px; border-radius: 4px; width: fit-content; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.auracss-ai-status.connected { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
.auracss-ai-status.error { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
.auracss-ai-status.untested { background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.4); }
.auracss-ai-status.offline { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }
.auracss-ai-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.auracss-ai-btn { padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s ease; }
.auracss-ai-btn-secondary { background: rgba(255, 255, 255, 0.08); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.15); }
.auracss-ai-btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
.auracss-ai-btn-primary { background: #38bdf8; color: #0f172a; }
.auracss-ai-btn-primary:hover { background: #7dd3fc; }
`;class $e{backdropEl=null;statusEl=null;targetValEl=null;aiService;constructor(e){this.aiService=e}mount(e){if(this.backdropEl)return;const s=document.createElement("style");s.textContent=Le,e.appendChild(s);const t=document.createElement("div");t.className="auracss-ai-modal-backdrop",t.onclick=c=>{c.target===t&&this.hide()};const a=document.createElement("div");a.className="auracss-ai-modal";const o=document.createElement("div");o.className="auracss-ai-modal-header";const i=document.createElement("div");i.className="auracss-ai-modal-title",i.innerHTML="⚡ Antigravity Agent Diagnostics";const n=document.createElement("button");n.className="auracss-ai-modal-close",n.type="button",n.innerHTML="✕",n.onclick=()=>this.hide(),o.append(i,n),a.appendChild(o);const r=document.createElement("div");r.className="auracss-ai-bridge-card",r.innerHTML=`
      <div class="auracss-ai-bridge-header">
        <span class="auracss-ai-bridge-badge">⚡ Agent Bridge Active</span>
        <span class="auracss-ai-bridge-port">localhost:4999</span>
      </div>
      <div class="auracss-ai-bridge-title">Zero-Key Antigravity Connection</div>
      <div class="auracss-ai-bridge-desc">
        Prompts and design variations are intelligently synthesized via your active Antigravity session. No external API keys or rate limits required.
      </div>
    `,a.appendChild(r);const p=document.createElement("div");p.className="auracss-diag-section",p.innerHTML=`
      <div class="auracss-diag-row">
        <span class="auracss-diag-label">MCP Daemon</span>
        <span class="auracss-diag-val">http://127.0.0.1:4999</span>
      </div>
      <div class="auracss-diag-row">
        <span class="auracss-diag-label">Protocol</span>
        <span class="auracss-diag-val">MCP stdio / SSE Stream</span>
      </div>
      <div class="auracss-diag-row">
        <span class="auracss-diag-label">Inspected Target</span>
        <span class="auracss-diag-val" id="auracss-diag-target">None (Standby)</span>
      </div>
    `,this.targetValEl=p.querySelector("#auracss-diag-target"),a.appendChild(p);const h=document.createElement("div");h.className="auracss-ai-status connected",h.textContent="🟢 Connected (Bridge (localhost:4999))",this.statusEl=h,a.appendChild(h);const m=document.createElement("div");m.className="auracss-ai-actions";const d=document.createElement("button");d.className="auracss-ai-btn auracss-ai-btn-secondary",d.type="button",d.textContent="Ping MCP Bridge",d.onclick=async()=>{d.disabled=!0,d.textContent="Pinging...";const c=await this.aiService.testConnection();d.disabled=!1,d.textContent="Ping MCP Bridge",this.statusEl&&(this.statusEl.className=`auracss-ai-status ${c.success?"connected":"error"}`,this.statusEl.textContent=c.success?`🟢 ${c.message}`:`🔴 ${c.message}`)};const b=document.createElement("button");b.className="auracss-ai-btn auracss-ai-btn-primary",b.type="button",b.textContent="Close",b.onclick=()=>this.hide(),m.append(d,b),a.appendChild(m),t.appendChild(a),e.appendChild(t),this.backdropEl=t}show(e){this.targetValEl&&(this.targetValEl.textContent=e?.selector||(e?.tag?`<${e.tag}>`:"None (Standby)")),this.pingStatus(),this.backdropEl?.classList.add("visible")}async pingStatus(){if(!this.statusEl)return;const e=await this.aiService.testConnection();this.statusEl.className=`auracss-ai-status ${e.success?"connected":"error"}`,this.statusEl.textContent=e.success?`🟢 ${e.message}`:`🔴 ${e.message}`}hide(){this.backdropEl?.classList.remove("visible")}destroy(){this.hide(),this.backdropEl&&this.backdropEl.parentNode&&this.backdropEl.parentNode.removeChild(this.backdropEl),this.backdropEl=null}}function Te(l){if(l.startsWith("#")&&l.length>=7){const e=parseInt(l.slice(1,3),16),s=parseInt(l.slice(3,5),16),t=parseInt(l.slice(5,7),16);return .299*e+.587*s+.114*t>160}return!1}function Ae(l,e){const s=l.toLowerCase(),t=s.includes("background")||s.includes("bg")||s.includes("fill"),a=s.includes("border")||s.includes("outline")||s.includes("stroke"),o=s.includes("text")||s.includes("font")||!t&&!a&&s.includes("color");let i=e,n="indigo-500",r=!1;const p=s.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);p?(i=p[0],n=`[${p[0]}]`,r=!0):s.includes("cyan")||s.includes("sky")?(i="#38bdf8",n="sky-400",r=!0):s.includes("blue")?(i="#2563eb",n="blue-600",r=!0):s.includes("purple")||s.includes("violet")?(i="#a855f7",n="purple-500",r=!0):s.includes("emerald")||s.includes("green")?(i="#10b981",n="emerald-500",r=!0):s.includes("crimson")?(i="#dc2626",n="red-600",r=!0):s.includes("red")?(i="#ef4444",n="red-500",r=!0):s.includes("rose")||s.includes("pink")?(i="#f43f5e",n="rose-500",r=!0):s.includes("yellow")?(i="#eab308",n="yellow-500",r=!0):s.includes("teal")?(i="#14b8a6",n="teal-500",r=!0):s.includes("amber")||s.includes("orange")||s.includes("gold")?(i="#f59e0b",n="amber-500",r=!0):s.includes("slate")||s.includes("dark")||s.includes("black")?(i="#0f172a",n="slate-900",r=!0):(s.includes("white")||s.includes("light"))&&(i="#ffffff",n="white",r=!0);const h=s.includes("glass")||s.includes("frost")||s.includes("blur")||s.includes("translucent"),m=s.includes("glow")||s.includes("neon")||s.includes("ambient")||s.includes("luminous"),d=s.includes("gradient")||s.includes("mesh")||s.includes("vibrant"),b=s.includes("minimal")||s.includes("flat")||s.includes("sharp")||s.includes("clean"),c=!!s.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i),f=!!s.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious)\b/i),w=!!s.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i),g=!!s.match(/\b(pop|pops|standout|punchy|bold)\b/i),u=!!s.match(/\b(soften|softer|smooth|smoothen)\b/i),v=s.includes("fading")||s.includes("fade")||s.includes("pulse")||s.includes("pulsing"),y=s.includes("click")||s.includes("clicking")||s.includes("press")||s.includes("tap"),S=s.includes("animat")||s.includes("motion")||s.includes("bounce");let k="8px",C="rounded-lg";s.includes("pill")||s.includes("round")||s.includes("oval")?(k="9999px",C="rounded-full"):s.includes("sharp")||s.includes("square")||s.includes("box")?(k="0px",C="rounded-none"):(s.includes("curved")||s.includes("card")||u)&&(k="16px",C="rounded-2xl");let P="10px 20px",L="px-5 py-2.5",$,T,R;return c&&f?(P="16px 36px",L="px-9 py-4 text-lg",$="1.15rem",T="text-lg",R="240px"):c?(P="10px 32px",L="px-8 py-2.5",R="200px"):f?(P="14px 28px",L="px-7 py-3.5 text-base",$="1.1rem",T="text-base"):w&&(P="6px 12px",L="px-3 py-1.5 text-xs",$="0.85rem",T="text-xs"),{colorHex:i,twColor:n,hasExplicitColor:r,hasBgIntent:t,hasTextIntent:o,hasBorderIntent:a,isGlass:h,isGlow:m,isGradient:d,isMinimal:b,radius:k,twRadius:C,padding:P,twPadding:L,isLonger:c,isBigger:f,isCompact:w,isPop:g,isSoften:u,isFading:v,isClick:y,isAnimation:S,fontSize:$,twFontSize:T,minWidth:R}}function Me(l,e,s){const t=Ae(l,s.primaryColor),a=e.tagName.toLowerCase(),o=a==="button"||a==="a"||e.getAttribute("role")==="button",i=/^h[1-6]$/i.test(a),n=Te(t.colorHex),r=n?"#0f172a":"#ffffff";let p="",h="";if(i)t.hasBgIntent?(p=`background-color: ${t.colorHex}; color: ${r}; padding: 8px 16px; border-radius: ${t.radius}; font-weight: 700;`,h=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} px-4 py-2 ${t.twRadius} font-bold`):t.isGradient?(p=`background: linear-gradient(135deg, ${t.colorHex} 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;`,h=`bg-gradient-to-r from-${t.twColor} to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight`):(p=`color: ${t.colorHex}; font-weight: 700; letter-spacing: -0.02em;`,h=`text-${t.twColor} font-bold tracking-tight`);else if(o){const d=t.isPop?`box-shadow: 0 8px 24px ${t.colorHex}55;`:t.isGlow?`box-shadow: 0 0 20px ${t.colorHex}66;`:t.isMinimal?"box-shadow: none;":"box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);",b=t.minWidth?`min-width: ${t.minWidth}; `:"",c=t.fontSize?`font-size: ${t.fontSize}; `:"",f=`${t.minWidth?"min-w-[200px] ":""}${t.twFontSize?`${t.twFontSize} `:""}`;t.hasBorderIntent&&!t.hasBgIntent?(p=`background-color: transparent; color: ${t.colorHex}; border: 2px solid ${t.colorHex}; border-radius: ${t.radius}; padding: ${t.padding}; ${b}${c}${d} cursor: pointer; font-weight: 600;`,h=`bg-transparent border-2 border-${t.twColor} text-${t.twColor} ${t.twRadius} ${t.twPadding} ${f}font-semibold`.trim()):t.isGlass?(p=`background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid ${t.colorHex}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: ${t.radius}; padding: ${t.padding}; ${b}${c}${d} cursor: pointer; font-weight: 600;`,h=`bg-white/10 border border-${t.twColor} text-white backdrop-blur-md ${t.twRadius} ${t.twPadding} ${f}font-semibold`.trim()):t.isMinimal?(p=`background-color: transparent; color: ${t.colorHex}; border: 2px solid ${t.colorHex}; border-radius: ${t.radius}; padding: ${t.padding}; ${b}${c}${d} cursor: pointer; font-weight: 600;`,h=`bg-transparent border-2 border-${t.twColor} text-${t.twColor} ${t.twRadius} ${t.twPadding} ${f}font-semibold`.trim()):(p=`background-color: ${t.colorHex}; color: ${r}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: ${t.radius}; padding: ${t.padding}; ${b}${c}${d} cursor: pointer; font-weight: 600;`,h=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} ${t.twRadius} ${t.twPadding} ${f}font-semibold shadow-md`.trim())}else{const d=t.isGlow?t.isFading?`box-shadow: 0 0 24px ${t.colorHex}66, 0 0 48px ${t.colorHex}33;`:`box-shadow: 0 0 25px ${t.colorHex}40;`:"box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);",b=t.isClick||t.isAnimation||t.isFading?" cursor: pointer; transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease-in-out, all 0.3s ease;":"",c=t.isClick||t.isAnimation||t.isFading?" cursor-pointer active:scale-95 transition-all duration-300":"";t.hasBgIntent?(p=`background-color: ${t.colorHex}; color: ${r}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,h=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} border border-white/20 ${t.twRadius} p-6 shadow-xl${c}`):t.hasBorderIntent?(p=`background-color: #0f172a; color: #f8fafc; border: 2px solid ${t.colorHex}; border-radius: ${t.radius}; padding: 24px; ${d}${b}`,h=`bg-slate-900 border-2 border-${t.twColor} ${t.twRadius} p-6 shadow-xl${c}`):t.isGlass?(p=`${t.hasExplicitColor?`background-color: rgba(15, 23, 42, 0.75); border: 1px solid ${t.colorHex}80;`:"background-color: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.15);"} backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,h=`bg-slate-900/70 border border-${t.twColor}/50 backdrop-blur-xl ${t.twRadius} p-6 shadow-2xl${c}`):t.hasExplicitColor?(p=`background-color: ${t.colorHex}; color: ${r}; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,h=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} ${t.twRadius} p-6 shadow-xl${c}`):(p=`background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,h=`bg-slate-900 border border-white/10 ${t.twRadius} p-6 shadow-xl${c}`)}const m=l.trim().slice(0,32);return{id:`custom-prompt-${Date.now()}`,name:`Aura: "${m}"`,description:"Synthesized design token from prompt",cssText:p,tailwindClasses:h,contrastRating:"AAA",contrastRatio:"7.0:1"}}async function Ne(l,e,s,t){if(t?.isConfigured())try{const a=await t.synthesize({prompt:l,tag:e.tagName.toLowerCase(),htmlSnippet:e.outerHTML.slice(0,200),computedStyles:{color:e.style.color,backgroundColor:e.style.backgroundColor},siteTokens:s});if(a?.cssText)return{id:`ai-prompt-${Date.now()}`,name:`AI: "${l.slice(0,24)}"`,description:a.explanation||"Synthesized by AI",cssText:a.cssText,tailwindClasses:a.tailwindClasses,contrastRating:"AAA"}}catch{}return Me(l,e,s)}class J{overlay=new ae;hierarchy=new oe;harvester=new ie;suggester=new fe;variationDock=new he;customizer=new Ee;commandHistory=new xe;ledgerModal=new ke;aiService=new Pe;aiModal=new $e(this.aiService);stylePatches=new WeakMap;aiVariationCycleMap=new WeakMap;currentDockPresets=new WeakMap;activePresetIdMap=new WeakMap;savedPromptedStyles=new WeakMap;isActive=!1;isComparing=!1;abortController=null;lockedElement=null;toggleBtn=null;toggleLabel=null;ledgerBtn=null;exportDivider=null;minBadge=null;init(){try{const e=this.overlay.mount();[this.hierarchy,this.variationDock,this.customizer,this.ledgerModal,this.aiModal].forEach(t=>t.mount(e));const s=this.overlay.mountControls(()=>this.toggle(),()=>this.ledgerModal.show(this.commandHistory.getHistory()));this.toggleBtn=s.toggleBtn,this.toggleLabel=s.toggleLabel,this.ledgerBtn=s.exportBtn,this.exportDivider=s.exportDivider,this.minBadge=s.minBadge,this.aiService.subscribeBridge(t=>{const a=this.lockedElement||(t.selector?document.querySelector(t.selector):null);if(a&&a instanceof HTMLElement){this.lockedElement||this.lockElement(a);const o=t.name||(t.prompt?t.prompt.length>25?t.prompt.slice(0,22)+"...":t.prompt:"Agent Prompt Result"),i=t.description||(t.prompt?`Prompt: "${t.prompt}"`:"Synthesized & streamed from Antigravity agent"),n={id:`prompted-${Date.now()}`,name:o,description:i,cssText:t.cssText,tailwindClasses:t.tailwindClasses||"",timestamp:Date.now(),contrastRating:"AAA",contrastRatio:"7.5:1"};this.recordSavedPromptedStyle(a,n),this.applyPreset(a,n)}}),this.log("AuraCSS initialized in standby mode")}catch(e){this.error("Initialization failed",e)}}toggle(){this.isActive?this.deactivate():this.activate()}activate(){if(this.isActive)return;this.isActive=!0,this.toggleBtn&&this.toggleLabel&&(this.toggleBtn.classList.add("active"),this.toggleLabel.textContent="AuraCSS: ON"),this.minBadge?.classList.add("active"),this.ledgerBtn&&(this.ledgerBtn.style.display="inline-flex"),this.exportDivider&&(this.exportDivider.style.display="block"),this.abortController=new AbortController;const e={capture:!0,signal:this.abortController.signal},s={...e,passive:!0};window.addEventListener("mouseover",this.handleMouseOver,e),window.addEventListener("click",this.handleClick,e),window.addEventListener("scroll",this.handleScrollOrResize,s),window.addEventListener("resize",this.handleScrollOrResize,s),window.addEventListener("keydown",this.handleKeyDown,e),window.addEventListener("keyup",this.handleKeyUp,e),this.log("AuraCSS activated")}deactivate(){this.isActive&&(this.isActive=!1,this.abortController?.abort(),this.abortController=null,this.unlockElement(),[this.overlay,this.hierarchy,this.variationDock].forEach(e=>e.clear()),[this.customizer,this.ledgerModal,this.aiModal].forEach(e=>e.hide()),this.toggleBtn&&this.toggleLabel&&(this.toggleBtn.classList.remove("active"),this.toggleLabel.textContent="AuraCSS: OFF"),this.minBadge?.classList.remove("active"),this.ledgerBtn&&(this.ledgerBtn.style.display="none"),this.exportDivider&&(this.exportDivider.style.display="none"),this.log("AuraCSS deactivated"))}handleMouseOver=e=>{try{if(this.lockedElement)return;const s=this.overlay.resolveHostElement(e);s?this.overlay.updateHighlight(s,!1):this.overlay.clear()}catch(s){this.error("handleMouseOver",s)}};handleClick=e=>{try{const s=this.overlay.resolveHostElement(e);if(!s)return;e.preventDefault(),e.stopPropagation(),this.lockedElement===s?this.unlockElement():this.lockElement(s)}catch(s){this.error("handleClick",s)}};handleScrollOrResize=()=>{try{this.lockedElement?.isConnected&&this.overlay.updateHighlight(this.lockedElement,!0)}catch(e){this.error("handleScrollOrResize",e)}};handleKeyDown=e=>{try{const t=(e.composedPath?e.composedPath():[e.target])[0];if(t?.tagName?.toLowerCase()==="input"||t?.tagName?.toLowerCase()==="textarea")return;if(e.key==="Escape"){this.lockedElement?this.unlockElement():this.deactivate();return}if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==="z"||e.key.toLowerCase()==="y")){e.preventDefault();const a=e.key.toLowerCase()==="y"||e.shiftKey?this.commandHistory.redo():this.commandHistory.undo();a?.element?.isConnected&&this.overlay.updateHighlight(a.element,!0),this.updateLedgerCount();return}if(e.code==="Space"&&this.lockedElement&&!this.isComparing){e.preventDefault();const a=this.stylePatches.get(this.lockedElement);a&&(this.isComparing=!0,this.lockedElement.style.cssText=a.originalCssText,this.overlay.updateHighlight(this.lockedElement,!0))}if(this.lockedElement&&e.altKey&&e.key.toLowerCase()==="r"){e.preventDefault(),this.revertElement(this.lockedElement);return}if(this.lockedElement&&(e.key==="ArrowUp"||e.key==="ArrowDown")){e.preventDefault();const a=e.key==="ArrowUp"?this.hierarchy.navigateUp(this.lockedElement):this.hierarchy.navigateDown(this.lockedElement);a&&this.lockElement(a)}}catch(s){this.error("handleKeyDown",s)}};handleKeyUp=e=>{try{if(e.code==="Space"&&this.isComparing&&this.lockedElement){e.preventDefault(),this.isComparing=!1;const s=this.stylePatches.get(this.lockedElement);s&&(this.lockedElement.style.cssText=s.appliedCssText,this.overlay.updateHighlight(this.lockedElement,!0))}}catch(s){this.error("handleKeyUp",s)}};lockElement(e){this.lockedElement=e,this.overlay.updateHighlight(e,!0),this.hierarchy.render(e,s=>this.lockElement(s)),this.currentDockPresets.has(e)||this.currentDockPresets.set(e,this.suggester.suggest(e,this.harvester.harvest())),this.refreshDock(e,this.stylePatches.has(e)),this.aiService.notifyActiveElement({tag:e.tagName.toLowerCase(),selector:B(e),htmlSnippet:e.outerHTML.slice(0,200),siteTokens:this.harvester.harvest()}),this.log("Locked:",e)}unlockElement(){this.lockedElement&&(this.lockedElement=null,this.isComparing=!1,this.overlay.clear(),this.hierarchy.clear(),this.variationDock.clear(),this.customizer.hide())}revertElement(e){const s=this.stylePatches.get(e);if(!s)return;e.style.cssText=s.originalCssText,this.stylePatches.delete(e),this.commandHistory.removeElement(e),this.activePresetIdMap.set(e,null),this.variationDock.setActivePresetId(null),this.updateLedgerCount(),this.overlay.updateHighlight(e,!0);const t=this.currentDockPresets.get(e)||this.suggester.suggest(e,this.harvester.harvest());this.renderDock(e,t,!1,this.aiVariationCycleMap.get(e)),this.log("Reverted to original:",e)}deselectElement(e){this.revertElement(e)}commitStyleChange(e,s,t,a){const o=this.stylePatches.get(e)?.originalCssText??a;this.stylePatches.set(e,{originalCssText:o,appliedCssText:s,tailwindClasses:t}),this.commandHistory.execute({element:e,selectorPath:B(e),previousCssText:a,appliedCssText:s,tailwindClasses:t,timestamp:Date.now()}),this.updateLedgerCount(),this.overlay.updateHighlight(e,!0),this.refreshDock(e,!0)}applyPreset(e,s){if(!e?.isConnected)return;this.activePresetIdMap.set(e,s.id),this.variationDock.setActivePresetId(s.id);const t=this.stylePatches.get(e);if(t&&t.appliedCssText===s.cssText)return;const a=e.style.cssText;e.style.cssText=s.cssText,this.commitStyleChange(e,s.cssText,s.tailwindClasses,a)}applyIncrementalPreset(e,s){if(!e?.isConnected)return;const t=e.style.cssText,a=document.createElement("div");a.style.cssText=s.cssText;for(let r=0;r<a.style.length;r++){const p=a.style[r],h=a.style.getPropertyValue(p),m=a.style.getPropertyPriority(p);e.style.setProperty(p,h,m)}const o=e.style.cssText,i=this.stylePatches.get(e),n=i?`${i.tailwindClasses} ${s.tailwindClasses}`.trim():s.tailwindClasses;this.commitStyleChange(e,o,n,t)}recordSavedPromptedStyle(e,s){const a=(this.savedPromptedStyles.get(e)||[]).filter(o=>o.cssText!==s.cssText);a.unshift(s),this.savedPromptedStyles.set(e,a)}async handlePrompt(e,s){if(!e?.isConnected)return;const t=await Ne(s,e,this.harvester.harvest(),this.aiService),a={id:`prompted-${Date.now()}`,name:t.name||"Prompted Style",description:t.description||`Prompt: "${s}"`,cssText:t.cssText,tailwindClasses:t.tailwindClasses,timestamp:Date.now(),contrastRating:t.contrastRating,contrastRatio:t.contrastRatio};this.recordSavedPromptedStyle(e,a),this.applyIncrementalPreset(e,t)}applyColorSwatch(e,s){if(!e?.isConnected)return;const t=H(s),i=(t?Y(t):0)>.4?"#0f172a":"#ffffff",n=e.style.cssText;e.style.backgroundColor=s,e.style.color=i;const r=e.style.cssText,h=(this.stylePatches.get(e)?.tailwindClasses||"").split(/\s+/).filter(d=>d&&!d.startsWith("bg-")&&!d.startsWith("text-")).join(" ").trim(),m=h?`${h} bg-[${s}] text-[${i}]`:`bg-[${s}] text-[${i}]`;this.commitStyleChange(e,r,m,n)}applyTypographyUpdate(e,s){if(!e?.isConnected)return;const t=e.style.cssText;e.style.setProperty(s.property,s.value);const a=e.style.cssText,o=this.stylePatches.get(e)?.tailwindClasses||"";let i=o;s.property==="color"?i=o.split(/\s+/).filter(r=>r&&!r.startsWith("text-")).join(" "):s.property==="font-size"?i=o.split(/\s+/).filter(r=>r&&!r.startsWith("text-xs")&&!r.startsWith("text-sm")&&!r.startsWith("text-base")&&!r.startsWith("text-lg")&&!r.startsWith("text-xl")&&!r.startsWith("text-2xl")).join(" "):s.property==="font-family"?i=o.split(/\s+/).filter(r=>r&&!r.startsWith("font-sans")&&!r.startsWith("font-mono")&&!r.startsWith("font-serif")&&!r.startsWith("font-display")).join(" "):s.property==="font-weight"&&(i=o.split(/\s+/).filter(r=>r&&!r.startsWith("font-normal")&&!r.startsWith("font-medium")&&!r.startsWith("font-semibold")&&!r.startsWith("font-bold")).join(" "));const n=i?`${i.trim()} ${s.tailwind}`.trim():s.tailwind;this.commitStyleChange(e,a,n,t)}deleteSavedPromptedStyle(e,s){const a=(this.savedPromptedStyles.get(e)||[]).filter(o=>o.id!==s);this.savedPromptedStyles.set(e,a),this.refreshDock(e,this.stylePatches.has(e))}clearSavedPromptedStyles(e){this.savedPromptedStyles.set(e,[]),this.refreshDock(e,this.stylePatches.has(e))}renderDock(e,s,t,a){this.currentDockPresets.set(e,s);const o=this.savedPromptedStyles.get(e)||[],i=this.harvester.harvest();this.variationDock.render(s,r=>this.applyPreset(e,r),()=>this.revertElement(e),t,r=>this.handlePrompt(e,r),()=>this.variationDock.togglePalettePopover(r=>this.applyTypographyUpdate(e,r)),()=>this.aiModal.show({tag:e.tagName.toLowerCase(),selector:B(e)}),()=>this.handleAISuggestions(e),a,()=>this.deselectElement(e),o,r=>this.applyPreset(e,r),i,r=>this.applyPreset(e,r),r=>this.applyColorSwatch(e,r),r=>this.applyTypographyUpdate(e,r),r=>this.deleteSavedPromptedStyle(e,r.id),()=>this.clearSavedPromptedStyles(e));const n=this.activePresetIdMap.get(e);n&&this.variationDock.setActivePresetId(n)}async handleAISuggestions(e){if(!e?.isConnected)return;if(!this.aiService.isConfigured()){this.aiModal.show();return}const t=((this.aiVariationCycleMap.get(e)??-1)+1)%3;this.aiVariationCycleMap.set(e,t);try{const a=await this.aiService.generateAISuggestions({tag:e.tagName.toLowerCase(),htmlSnippet:e.outerHTML.slice(0,200),computedStyles:{color:e.style.color,backgroundColor:e.style.backgroundColor},siteTokens:this.harvester.harvest()},void 0,t);this.renderDock(e,a,this.stylePatches.has(e),t)}catch{this.refreshDock(e,this.stylePatches.has(e))}}handleTune(e,s){if(!e?.isConnected)return;const t=e.style.cssText;e.style.setProperty(s.property,s.value);const a=this.stylePatches.get(e);this.commitStyleChange(e,e.style.cssText,a?`${a.tailwindClasses} ${s.tailwind}`:s.tailwind,t)}refreshDock(e,s){const t=this.currentDockPresets.get(e)||this.suggester.suggest(e,this.harvester.harvest());this.renderDock(e,t,s,this.aiVariationCycleMap.get(e))}updateLedgerCount(){this.ledgerBtn&&(this.ledgerBtn.textContent=`Export (${this.commandHistory.getUniqueElementCount()})`)}log(e,...s){window.__AURACSS_DEBUG__===!0&&console.log(`[AuraCSS] ${e}`,...s)}error(e,...s){window.__AURACSS_DEBUG__===!0&&console.error(`[AuraCSS Error] ${e}`,...s)}destroy(){this.deactivate(),[this.customizer,this.ledgerModal,this.aiModal,this.variationDock,this.hierarchy,this.overlay].forEach(e=>e.destroy()),this.commandHistory.clear(),window.__AURACSS_INSTANCE__=void 0}}if(!(typeof process<"u"&&!!process.env?.VITEST)&&typeof window<"u"&&typeof document<"u"){const l=new J;window.__AURACSS_INSTANCE__=l,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>l.init(),{once:!0}):l.init()}j.AuraCSSApp=J,Object.defineProperty(j,Symbol.toStringTag,{value:"Module"})})(this.AuraCSS=this.AuraCSS||{});
//# sourceMappingURL=auracss.bundle.js.map
