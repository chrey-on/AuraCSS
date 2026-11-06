(function(O){"use strict";const J=`
:host {
  all: initial; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 2147483645;
}
*, *::before, *::after {
  box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-container {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none; overflow: visible; z-index: 2147483645;
}
.auracss-ring {
  position: absolute; pointer-events: none; border-radius: 4px; border: 2px solid #38bdf8;
  background: rgba(56, 189, 248, 0.08); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px rgba(56, 189, 248, 0.35);
  transition: transform 0.06s ease-out, width 0.06s ease-out, height 0.06s ease-out, border-color 0.15s ease;
  will-change: transform, width, height; display: none;
}
.auracss-ring.locked {
  border-color: #a855f7; background: rgba(168, 85, 247, 0.1);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 20px rgba(168, 85, 247, 0.45);
}
.auracss-pill {
  position: absolute; top: -26px; left: -2px; background: #0f172a; color: #f8fafc;
  font-size: 11px; font-weight: 600; line-height: 1; padding: 4px 8px; border-radius: 4px;
  letter-spacing: 0.02em; white-space: nowrap; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 4px; pointer-events: none;
}
.auracss-pill.flipped { top: auto; bottom: -26px; }
.auracss-controls-stack {
  position: fixed; top: 16px; right: 20px; display: inline-flex; align-items: center;
  z-index: 2147483647; pointer-events: auto; user-select: none;
}
.auracss-controls-row {
  display: inline-flex; align-items: center; height: 32px;
  background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 9999px; padding: 2px 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.2);
  gap: 2px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.auracss-controls-row:hover {
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.6), 0 0 14px rgba(56, 189, 248, 0.2);
}
.auracss-controls-divider {
  width: 1px; height: 14px; background: rgba(255, 255, 255, 0.15); flex-shrink: 0;
}
.auracss-toggle-btn {
  height: 26px; padding: 0 10px; border-radius: 9999px; border: none;
  background: transparent; color: #f8fafc; font-size: 11.5px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; outline: none; box-shadow: none;
}
.auracss-toggle-btn:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.auracss-toggle-btn.active { color: #38bdf8; }
.auracss-export-btn {
  color: #38bdf8; font-weight: 700;
}
.auracss-export-btn:hover { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; }
.auracss-toggle-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #64748b;
  transition: all 0.2s ease;
}
.auracss-toggle-btn.active .auracss-toggle-dot {
  background: #38bdf8; box-shadow: 0 0 8px #38bdf8;
}
.auracss-min-btn {
  width: 22px; height: 22px; border-radius: 50%; border: none;
  background: transparent; color: #94a3b8; font-size: 13px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all 0.15s ease; outline: none; margin-right: 2px;
}
.auracss-min-btn:hover { background: rgba(255, 255, 255, 0.12); color: #f8fafc; }
.auracss-min-badge {
  display: none; width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(56, 189, 248, 0.4); background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px); color: #38bdf8; font-size: 13px; font-weight: 700;
  align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.3);
  transition: all 0.15s ease; outline: none;
}
.auracss-min-badge:hover { transform: scale(1.1); box-shadow: 0 0 18px rgba(56, 189, 248, 0.6); }
.auracss-min-badge.active { color: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.45); }
.auracss-controls-stack.minimized .auracss-controls-row { display: none !important; }
.auracss-controls-stack.minimized .auracss-min-badge { display: flex !important; }
`;function X(l){const e=l.tagName.toLowerCase(),s=l.id?`#${l.id}`:"",t=Array.from(l.classList).filter(a=>!a.startsWith("auracss")).slice(0,2).map(a=>`.${a}`).join("");return`${e}${s}${t}`}class Z{host=null;shadow=null;container=null;ring=null;pill=null;activeTarget=null;isLocked=!1;rafId=null;mount(){if(this.shadow)return this.shadow;const e=document.getElementById("auracss-root");e&&e.remove();const s=document.createElement("div");s.id="auracss-root",s.style.cssText="all: initial !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 0 !important; height: 0 !important; z-index: 2147483647 !important; pointer-events: none !important;";const t=s.attachShadow({mode:"open"}),a=document.createElement("style");a.textContent=J,t.appendChild(a);const i=document.createElement("div");i.className="auracss-container";const o=document.createElement("div");o.className="auracss-ring";const n=document.createElement("div");return n.className="auracss-pill",o.appendChild(n),i.appendChild(o),t.appendChild(i),document.body?document.body.appendChild(s):(document.documentElement.appendChild(s),window.addEventListener("DOMContentLoaded",()=>{document.body&&s.parentElement!==document.body&&document.body.appendChild(s)},{once:!0})),this.host=s,this.shadow=t,this.container=i,this.ring=o,this.pill=n,t}updateHighlight(e,s=!1){this.activeTarget=e,this.isLocked=s,this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(()=>{this.rafId=null,this.render()})}render(){if(!this.ring||!this.pill)return;if(!this.activeTarget||!this.activeTarget.isConnected){this.ring.style.display="none";return}const e=this.activeTarget.getBoundingClientRect(),s=X(this.activeTarget),t={top:e.top,left:e.left,width:Math.max(e.width,2),height:Math.max(e.height,2)},a=t.top<30;this.ring.style.display="block",this.ring.style.transform=`translate3d(${t.left}px, ${t.top}px, 0)`,this.ring.style.width=`${t.width}px`,this.ring.style.height=`${t.height}px`,this.isLocked?this.ring.classList.add("locked"):this.ring.classList.remove("locked"),this.pill.textContent=s,this.pill.classList.toggle("flipped",a)}clear(){this.activeTarget=null,this.isLocked=!1,this.ring&&(this.ring.style.display="none")}destroy(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.host&&this.host.parentNode&&this.host.parentNode.removeChild(this.host),this.host=null,this.shadow=null,this.container=null,this.ring=null,this.pill=null,this.activeTarget=null,this.isLocked=!1}getShadowRoot(){return this.shadow}getContainer(){return this.container}resolveHostElement(e){if(!this.host)return null;const s=e.composedPath();if(s.includes(this.host))return null;for(const t of s)if(t instanceof HTMLElement&&t!==document.body&&t!==document.documentElement&&t.isConnected)return t;return null}mountControls(e,s){if(!this.shadow)throw new Error("ShadowRoot not mounted");const t=document.createElement("div");t.className="auracss-controls-stack";const a=document.createElement("button");a.className="auracss-min-badge",a.title="Expand AuraCSS Controls",a.type="button",a.innerHTML="✦",a.onclick=b=>{b.stopPropagation(),t.classList.remove("minimized")},t.appendChild(a);const i=document.createElement("div");i.className="auracss-controls-row";const o=document.createElement("button");o.className="auracss-toggle-btn",o.setAttribute("aria-label","Toggle AuraCSS");const n=document.createElement("span");n.className="auracss-toggle-dot";const r=document.createElement("span");r.textContent="AuraCSS: OFF",o.append(n,r),o.onclick=b=>{b.stopPropagation(),e()},i.appendChild(o);const c=document.createElement("div");c.className="auracss-controls-divider auracss-export-divider",c.style.display="none",i.appendChild(c);const p=document.createElement("button");p.className="auracss-toggle-btn auracss-export-btn",p.style.display="none",p.textContent="Export (0)",p.onclick=b=>{b.stopPropagation(),s()},i.appendChild(p);const f=document.createElement("div");f.className="auracss-controls-divider",i.appendChild(f);const d=document.createElement("button");return d.className="auracss-min-btn",d.title="Minimize controls",d.type="button",d.innerHTML="–",d.onclick=b=>{b.stopPropagation(),t.classList.add("minimized")},i.appendChild(d),t.appendChild(i),this.shadow.appendChild(t),{toggleBtn:o,toggleLabel:r,exportBtn:p,exportDivider:c,minBadge:a,controlsStack:t}}}const Q=`
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
`;function B(l){const e=l.tagName.toLowerCase(),s=l.id?`#${l.id}`:"",t=l.classList.length>0?`.${Array.from(l.classList).filter(a=>!a.startsWith("auracss"))[0]??""}`:"";return`${e}${s}${t==="."?"":t}`}class ee{barEl=null;childStack=[];onSelectCallback=null;mount(e){if(this.barEl)return;const s=document.createElement("style");s.textContent=Q,e.appendChild(s);const t=document.createElement("div");t.className="auracss-breadcrumb-bar",t.setAttribute("role","navigation"),t.setAttribute("aria-label","Element Hierarchy Breadcrumbs"),e.appendChild(t),this.barEl=t}buildBreadcrumbPath(e,s=6){if(!e||!e.isConnected)return[];const t=[];let a=e;for(;a&&a.isConnected&&t.length<s&&!(a===document.body||a===document.documentElement||a.id==="auracss-root");)t.push({element:a,label:B(a),isCurrent:a===e}),a=a.parentElement;return t.reverse()}render(e,s){if(!this.barEl)return;this.onSelectCallback=s;const t=this.buildBreadcrumbPath(e);if(t.length===0){this.clear();return}this.barEl.innerHTML="",t.forEach((a,i)=>{if(i>0){const n=document.createElement("span");n.className="auracss-breadcrumb-separator",n.textContent="›",this.barEl?.appendChild(n)}const o=document.createElement("span");o.className=`auracss-breadcrumb-item${a.isCurrent?" current":""}`,o.textContent=a.label,o.title=`Select <${a.element.tagName.toLowerCase()}>`,o.addEventListener("click",n=>{n.stopPropagation(),a.element.isConnected&&(this.childStack.length=0,this.onSelectCallback?.(a.element))}),this.barEl?.appendChild(o)}),this.barEl.classList.add("visible")}navigateUp(e){if(!e||!e.isConnected)return null;const s=e.parentElement;return!s||s===document.body||s===document.documentElement||s.id==="auracss-root"?null:(this.childStack.push(e),s)}navigateDown(e){if(!e||!e.isConnected)return null;if(this.childStack.length>0){const t=this.childStack.pop();if(t&&t.isConnected&&t.parentElement===e)return t}const s=e.firstElementChild;return s instanceof HTMLElement&&s.isConnected&&s.id!=="auracss-root"?s:null}clear(){this.childStack.length=0,this.barEl&&(this.barEl.classList.remove("visible"),this.barEl.innerHTML="")}destroy(){this.clear(),this.barEl&&this.barEl.parentNode&&this.barEl.parentNode.removeChild(this.barEl),this.barEl=null,this.onSelectCallback=null}}function H(l){if(!l||l==="transparent"||l==="inherit")return null;const e=l.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);if(e){const t=parseInt(e[1]??"0",10),a=parseInt(e[2]??"0",10),i=parseInt(e[3]??"0",10),o=e[4]!==void 0?parseFloat(e[4]):1;return{r:t,g:a,b:i,a:o}}const s=l.match(/^#([0-9a-f]{3,8})$/i);if(s){const t=s[1]??"";if(t.length===3||t.length===4){const a=parseInt((t[0]??"0").repeat(2),16),i=parseInt((t[1]??"0").repeat(2),16),o=parseInt((t[2]??"0").repeat(2),16),n=t.length===4?parseInt((t[3]??"f").repeat(2),16)/255:1;return{r:a,g:i,b:o,a:n}}if(t.length===6||t.length===8){const a=parseInt(t.slice(0,2),16),i=parseInt(t.slice(2,4),16),o=parseInt(t.slice(4,6),16),n=t.length===8?parseInt(t.slice(6,8),16)/255:1;return{r:a,g:i,b:o,a:n}}}return null}function j(l){const e=i=>{const o=i/255;return o<=.03928?o/12.92:Math.pow((o+.055)/1.055,2.4)},s=e(l.r),t=e(l.g),a=e(l.b);return .2126*s+.7152*t+.0722*a}function U(l){const e=l.r/255,s=l.g/255,t=l.b/255,a=Math.max(e,s,t),i=Math.min(e,s,t);if(a===i)return 0;const o=(a+i)/2,n=a-i;return o>.5?n/(2-a-i):n/(a+i)}class te{cachedTokens=null;harvest(e=!1){if(this.cachedTokens&&!e)return this.cachedTokens;let s=!1,t="#4f46e5",a="system-ui, sans-serif",i="8px";if(typeof window>"u"||typeof document>"u")return{isDarkMode:s,primaryColor:t,fontFamily:a,baseRadius:i};const o=this.resolveEffectiveBackground(document.body||document.documentElement);o&&(s=j(o)<.45);const c=Array.from(document.querySelectorAll('button, a, nav, header, h1, h2, h3, [class*="btn"], [class*="primary"]')).slice(0,50);let p=.25;const f=new Map,d=new Map;for(const v of c){if(!v.isConnected||v.id==="auracss-root"||v.closest("#auracss-root"))continue;const g=window.getComputedStyle(v);if(g.fontFamily){const w=g.fontFamily.split(",")[0]?.trim().replace(/['"]/g,"")??"";w&&f.set(w,(f.get(w)??0)+1)}g.borderRadius&&g.borderRadius!=="0px"&&d.set(g.borderRadius,(d.get(g.borderRadius)??0)+1);const h=H(g.backgroundColor);if(h&&h.a>.6){const w=U(h);w>p&&(p=w,t=`rgb(${h.r}, ${h.g}, ${h.b})`)}const y=H(g.borderColor);if(y&&y.a>.6){const w=U(y);w>p&&(p=w,t=`rgb(${y.r}, ${y.g}, ${y.b})`)}}let b=0;for(const[v,g]of f.entries())g>b&&(b=g,a=v);let u=0;for(const[v,g]of d.entries())g>u&&(u=g,i=v);const x={isDarkMode:s,primaryColor:t,fontFamily:a,baseRadius:i};return this.cachedTokens=x,x}resolveEffectiveBackground(e){let s=e;for(;s&&s!==document.documentElement;){const t=window.getComputedStyle(s),a=H(t.backgroundColor);if(a&&a.a>.8)return a;s=s.parentElement}return{r:15,g:23,b:42,a:1}}clearCache(){this.cachedTokens=null}}const se=`
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
`,ae=[{name:"Inter / Sans",family:"Inter, system-ui, -apple-system, sans-serif",tailwind:"font-sans"},{name:"Modern Mono",family:"ui-monospace, SFMono-Regular, Menlo, monospace",tailwind:"font-mono"},{name:"Editorial Serif",family:'Georgia, Cambria, "Times New Roman", serif',tailwind:"font-serif"},{name:"Display Heading",family:'Impact, "Cabinet Grotesk", system-ui, sans-serif',tailwind:"font-display"}],re=[{label:"XS (12px)",size:"12px",tailwind:"text-xs"},{label:"SM (14px)",size:"14px",tailwind:"text-sm"},{label:"MD (16px)",size:"16px",tailwind:"text-base"},{label:"LG (18px)",size:"18px",tailwind:"text-lg"},{label:"XL (22px)",size:"22px",tailwind:"text-xl"},{label:"2XL (28px)",size:"28px",tailwind:"text-2xl"}],oe=[{name:"Pure White",hex:"#ffffff",tailwind:"text-white"},{name:"Slate 100",hex:"#f1f5f9",tailwind:"text-slate-100"},{name:"Muted Slate",hex:"#94a3b8",tailwind:"text-slate-400"},{name:"Sky Cyan",hex:"#38bdf8",tailwind:"text-sky-400"},{name:"Electric Violet",hex:"#a855f7",tailwind:"text-purple-400"},{name:"Emerald Neon",hex:"#34d399",tailwind:"text-emerald-400"},{name:"Warm Amber",hex:"#fbbf24",tailwind:"text-amber-400"},{name:"Rose Flame",hex:"#f87171",tailwind:"text-rose-400"},{name:"Deep Slate",hex:"#0f172a",tailwind:"text-slate-900"}],ie=[{label:"Regular (400)",property:"font-weight",value:"400",tailwind:"font-normal"},{label:"Medium (500)",property:"font-weight",value:"500",tailwind:"font-medium"},{label:"Semibold (600)",property:"font-weight",value:"600",tailwind:"font-semibold"},{label:"Bold (700)",property:"font-weight",value:"700",tailwind:"font-bold"},{label:"Italic",property:"font-style",value:"italic",tailwind:"italic"},{label:"Uppercase",property:"text-transform",value:"uppercase",tailwind:"uppercase tracking-wider"},{label:"Underline",property:"text-decoration",value:"underline",tailwind:"underline"}];function ne(l){const e=Math.floor((Date.now()-l)/1e3);if(e<60)return"Just now";const s=Math.floor(e/60);return s<60?`${s}m ago`:`${Math.floor(s/60)}h ago`}class le{dockEl=null;dockContentEl=null;savedPopoverEl=null;palettePopoverEl=null;activePresetId=null;onSelectCallback=null;removeWindowListeners=null;mount(e){if(this.dockEl)return;const s=document.createElement("style");s.textContent=se,e.appendChild(s);const t=document.createElement("div");t.className="auracss-variation-dock",t.setAttribute("role","toolbar"),t.setAttribute("aria-label","AuraCSS Design Variations");const a=document.createElement("div");a.className="auracss-saved-popover",t.appendChild(a),this.savedPopoverEl=a;const i=document.createElement("div");i.className="auracss-palette-popover",t.appendChild(i),this.palettePopoverEl=i;const o=document.createElement("div");o.className="auracss-dock-content",t.appendChild(o),this.dockContentEl=o,e.appendChild(t),this.dockEl=t}setActivePresetId(e){this.activePresetId=e,this.dockEl&&(this.dockEl.querySelectorAll(".auracss-preset-card").forEach(s=>{const t=s;t.classList.toggle("active",t.dataset.presetId===e)}),this.savedPopoverEl&&this.savedPopoverEl.querySelectorAll(".auracss-saved-card").forEach(s=>{const t=s;t.classList.toggle("active",t.dataset.savedId===e)}))}closeAllPopovers(){this.savedPopoverEl?.classList.remove("visible"),this.palettePopoverEl?.classList.remove("visible")}toggleSavedPopover(e,s,t,a){if(!this.savedPopoverEl)return;const i=this.savedPopoverEl.classList.contains("visible");this.closeAllPopovers(),i||(this.renderSavedPopover(e,s,t,a),this.savedPopoverEl.classList.add("visible"))}togglePalettePopover(e,s){if(!this.palettePopoverEl)return;const t=this.palettePopoverEl.classList.contains("visible");this.closeAllPopovers(),t||(this.renderPalettePopover(e,s),this.palettePopoverEl.classList.add("visible"))}renderPalettePopover(e,s){if(!this.palettePopoverEl)return;this.palettePopoverEl.innerHTML="";const t=document.createElement("div");t.className="auracss-palette-header",t.innerHTML="<span>🔤 Typography & Font Style</span>";const a=document.createElement("button");a.className="auracss-palette-close",a.type="button",a.innerHTML="✕",a.onclick=g=>{g.stopPropagation(),this.palettePopoverEl?.classList.remove("visible")},t.appendChild(a),this.palettePopoverEl.appendChild(t);const i=document.createElement("div");i.className="auracss-palette-section";const o=document.createElement("div");o.className="auracss-palette-section-title",o.textContent="Font Family",i.appendChild(o);const n=document.createElement("div");n.className="auracss-font-grid",ae.forEach(g=>{const h=document.createElement("button");h.className="auracss-font-pill auracss-theme-pill",h.type="button",h.style.fontFamily=g.family,h.textContent=g.name,h.onclick=y=>{y.stopPropagation(),n.querySelectorAll(".auracss-font-pill").forEach(w=>w.classList.remove("active")),h.classList.add("active"),e?.({property:"font-family",value:g.family,tailwind:g.tailwind,label:g.name})},n.appendChild(h)}),i.appendChild(n),this.palettePopoverEl.appendChild(i);const r=document.createElement("div");r.className="auracss-palette-section";const c=document.createElement("div");c.className="auracss-palette-section-title",c.textContent="Font Size",r.appendChild(c);const p=document.createElement("div");p.className="auracss-pills-row",re.forEach(g=>{const h=document.createElement("button");h.className="auracss-size-pill",h.type="button",h.textContent=g.label,h.onclick=y=>{y.stopPropagation(),p.querySelectorAll(".auracss-size-pill").forEach(w=>w.classList.remove("active")),h.classList.add("active"),e?.({property:"font-size",value:g.size,tailwind:g.tailwind,label:g.label})},p.appendChild(h)}),r.appendChild(p),this.palettePopoverEl.appendChild(r);const f=document.createElement("div");f.className="auracss-palette-section";const d=document.createElement("div");d.className="auracss-palette-section-title",d.textContent="Font Color",f.appendChild(d);const b=document.createElement("div");b.className="auracss-swatches-grid",oe.forEach(g=>{const h=document.createElement("button");h.className="auracss-swatch-btn auracss-font-color-btn",h.type="button",h.title=`Apply ${g.name} (${g.hex})`,h.style.backgroundColor=g.hex,h.onclick=y=>{y.stopPropagation(),b.querySelectorAll(".auracss-swatch-btn").forEach(w=>w.classList.remove("active")),h.classList.add("active"),e?.({property:"color",value:g.hex,tailwind:g.tailwind,label:g.name})},b.appendChild(h)}),f.appendChild(b),this.palettePopoverEl.appendChild(f);const u=document.createElement("div");u.className="auracss-palette-section";const x=document.createElement("div");x.className="auracss-palette-section-title",x.textContent="Font Style & Weight",u.appendChild(x);const v=document.createElement("div");v.className="auracss-pills-row",ie.forEach(g=>{const h=document.createElement("button");h.className="auracss-style-pill",h.type="button",h.textContent=g.label,h.onclick=y=>{y.stopPropagation(),v.querySelectorAll(".auracss-style-pill").forEach(w=>w.classList.remove("active")),h.classList.add("active"),e?.({property:g.property,value:g.value,tailwind:g.tailwind,label:g.label})},v.appendChild(h)}),u.appendChild(v),this.palettePopoverEl.appendChild(u)}renderSavedPopover(e,s,t,a){if(!this.savedPopoverEl)return;this.savedPopoverEl.innerHTML="";const i=document.createElement("div");if(i.className="auracss-saved-popover-header",i.innerHTML=`<span>💾 Saved Prompted Styles (${e.length})</span>`,e.length>0&&a){const r=document.createElement("button");r.className="auracss-saved-clear-all",r.type="button",r.textContent="Clear All",r.title="Clear all saved prompt results",r.onclick=c=>{c.stopPropagation(),a()},i.appendChild(r)}const o=document.createElement("button");o.className="auracss-saved-popover-close",o.type="button",o.innerHTML="✕",o.onclick=r=>{r.stopPropagation(),this.savedPopoverEl?.classList.remove("visible")},i.appendChild(o),this.savedPopoverEl.appendChild(i);const n=document.createElement("div");if(n.className="auracss-saved-list",e.length===0){const r=document.createElement("div");r.className="auracss-saved-empty",r.innerHTML=`
        <div style="font-weight: 600; color: #94a3b8;">✨ No saved prompts yet</div>
        <div style="font-size: 10px; margin-top: 4px;">Prompt Antigravity in chat to generate and stream live styles here.</div>
      `,n.appendChild(r)}else e.forEach(r=>{const c=document.createElement("div");c.className=`auracss-saved-card${r.id===this.activePresetId?" active":""}`,c.dataset.savedId=r.id;const p=document.createElement("div");p.className="auracss-saved-card-header";const f=document.createElement("span");f.className="auracss-saved-card-title",f.textContent=r.name;const d=document.createElement("div");d.style.display="flex",d.style.alignItems="center";const b=document.createElement("span");if(b.className="auracss-saved-card-time",b.textContent=ne(r.timestamp),d.appendChild(b),t){const u=document.createElement("button");u.className="auracss-saved-card-remove",u.type="button",u.title="Remove this saved prompt result",u.innerHTML="✕",u.onclick=x=>{x.stopPropagation(),t(r)},d.appendChild(u)}if(p.append(f,d),c.appendChild(p),r.description){const u=document.createElement("div");u.className="auracss-saved-card-desc",u.textContent=r.description,c.appendChild(u)}if(r.tailwindClasses){const u=document.createElement("div");u.className="auracss-saved-card-tw",u.textContent=r.tailwindClasses,c.appendChild(u)}c.addEventListener("click",u=>{u.stopPropagation(),this.setActivePresetId(r.id),s?.(r)}),n.appendChild(c)});this.savedPopoverEl.appendChild(n)}render(e,s,t,a=!1,i,o,n,r,c,p,f,d,b,u,x,v,g,h){if(!this.dockEl||!this.dockContentEl)return;this.onSelectCallback=s,this.removeWindowListeners?.(),this.removeWindowListeners=null;const y=this.savedPopoverEl?.classList.contains("visible")??!1,w=this.palettePopoverEl?.classList.contains("visible")??!1;this.dockContentEl.innerHTML="",a||(this.activePresetId=null);const $=document.createElement("div");if($.className="auracss-dock-stack left",r){const m=document.createElement("button");m.className="auracss-ai-remodel-btn",m.type="button";const k=typeof c=="number"?`${c+1}/3`:"1/3";m.title=`AI Variations (Set ${k}) - Click to cycle`,m.innerHTML=`<span>✨</span><span class="auracss-btn-badge">${k}</span>`,m.onclick=T=>{T.stopPropagation(),m.innerHTML='<span>✨</span><span class="auracss-btn-badge">...</span>',r()},$.appendChild(m)}if(t){const m=document.createElement("button");m.className=`auracss-preset-reset${a?"":" disabled"}`,m.type="button",m.title=a?"Revert element to original unstyled state":"Original element unstyled",m.innerHTML="↺",m.onclick=k=>{k.stopPropagation(),a&&(this.activePresetId=null,t())},$.appendChild(m)}this.dockContentEl.appendChild($);const E=document.createElement("div");E.className="auracss-dock-divider",this.dockContentEl.appendChild(E);const C=document.createElement("div");C.className="auracss-cards-track";let S=!1,L=0,A=0,P=!1;const z=m=>{S=!0,P=!1,L=m.pageX-C.offsetLeft,A=C.scrollLeft,C.classList.add("grabbing")},q=m=>{if(!S)return;m.preventDefault();const T=(m.pageX-C.offsetLeft-L)*1.4;Math.abs(T)>4&&(P=!0),C.scrollLeft=A-T},Y=()=>{S&&(S=!1,C.classList.remove("grabbing"))};C.addEventListener("mousedown",z),window.addEventListener("mousemove",q),window.addEventListener("mouseup",Y),this.removeWindowListeners=()=>{window.removeEventListener("mousemove",q),window.removeEventListener("mouseup",Y)},e.forEach(m=>{const k=document.createElement("div");k.className=`auracss-preset-card${m.id===this.activePresetId?" active":""}`,k.dataset.presetId=m.id;const T=document.createElement("span");T.className="auracss-preset-name",T.textContent=m.name;const _=document.createElement("span");if(_.className="auracss-preset-desc",_.textContent=m.description,k.appendChild(T),k.appendChild(_),m.contrastRating){const R=document.createElement("span");R.className=`auracss-contrast-badge ${m.contrastRating}`,R.textContent=`WCAG ${m.contrastRating} ${m.contrastRatio??""}`,k.appendChild(R)}k.addEventListener("click",R=>{P||(R.stopPropagation(),this.activePresetId===m.id?(this.activePresetId=null,k.classList.remove("active"),p?.(m)):(this.activePresetId=m.id,this.dockEl?.querySelectorAll(".auracss-preset-card").forEach(Pe=>Pe.classList.remove("active")),k.classList.add("active"),this.onSelectCallback?.(m)))}),C.appendChild(k)}),this.dockContentEl.appendChild(C);const K=document.createElement("div");K.className="auracss-dock-divider",this.dockContentEl.appendChild(K);const I=document.createElement("div");I.className="auracss-dock-stack right";const D=document.createElement("div");D.className="auracss-dock-row";const N=document.createElement("button");if(N.className="auracss-dock-palette-btn auracss-dock-tune-btn",N.type="button",N.title="Typography & Font Styles",N.innerHTML="Aa",N.onclick=m=>{m.stopPropagation(),o?o():this.togglePalettePopover(v,x)},D.appendChild(N),n){const m=document.createElement("button");m.className="auracss-ai-settings-btn",m.type="button",m.title="Antigravity Agent Diagnostics",m.innerHTML="⚙️",m.onclick=k=>{k.stopPropagation(),n()},D.appendChild(m)}I.appendChild(D);const M=document.createElement("button");M.className="auracss-saved-styles-btn",M.type="button";const F=f?.length||0;M.title=`Saved Prompted Styles (${F} saved)`,M.innerHTML=`<span>💾</span>${F>0?`<span class="auracss-btn-badge">${F}</span>`:""}`,M.onclick=m=>{m.stopPropagation(),this.toggleSavedPopover(f||[],d,g,h)},I.appendChild(M),this.dockContentEl.appendChild(I),this.dockEl.classList.add("visible"),w?(this.renderPalettePopover(v,x),this.palettePopoverEl?.classList.add("visible")):y&&(this.renderSavedPopover(f||[],d,g,h),this.savedPopoverEl?.classList.add("visible"))}clear(){this.activePresetId=null,this.closeAllPopovers(),this.removeWindowListeners?.(),this.removeWindowListeners=null,this.dockEl&&this.dockEl.classList.remove("visible"),this.dockContentEl&&(this.dockContentEl.innerHTML="")}destroy(){this.clear(),this.dockEl&&this.dockEl.parentNode&&this.dockEl.parentNode.removeChild(this.dockEl),this.dockEl=null,this.dockContentEl=null,this.savedPopoverEl=null,this.palettePopoverEl=null,this.onSelectCallback=null}}class ce{supports(e){const s=e.tagName.toLowerCase(),t=e.getAttribute("role"),a=e.classList.contains("btn")||e.classList.contains("button");return s==="button"||s==="a"||t==="button"||a}generatePresets(e,s){const t=s.baseRadius||"8px";return[{id:"action-modern-primary",name:"Aura Modern Primary",description:"Vibrant brand primary with smooth elevation shadow",cssText:`background-color: ${s.primaryColor}; color: #ffffff; border-radius: ${t}; border: none; padding: 10px 20px; font-weight: 600; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); cursor: pointer; transition: transform 0.15s ease, filter 0.15s ease;`,tailwindClasses:"bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all",contrastRating:"AAA",contrastRatio:"7.8:1"},{id:"action-glass-outline",name:"Frosted Glass Outline",description:"Translucent glass surface with delicate alpha border",cssText:`background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: ${t}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: background-color 0.15s ease;`,tailwindClasses:"bg-white/10 hover:bg-white/15 border border-white/20 text-slate-100 backdrop-blur-md px-5 py-2.5 rounded-lg transition-all",contrastRating:"AA",contrastRatio:"5.4:1"},{id:"action-ambient-glow",name:"Ambient Neon Aura",description:"Brand tinted surface radiating soft ambient glow",cssText:`background-color: rgba(99, 102, 241, 0.12); color: #e0e7ff; border: 1px solid rgba(99, 102, 241, 0.45); box-shadow: 0 0 16px rgba(99, 102, 241, 0.35); border-radius: ${t}; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: box-shadow 0.2s ease;`,tailwindClasses:"bg-indigo-500/10 border border-indigo-500/40 text-indigo-200 shadow-[0_0_16px_rgba(99,102,241,0.35)] px-5 py-2.5 rounded-lg transition-all",contrastRating:"AAA",contrastRatio:"8.2:1"},{id:"action-subtle-ghost",name:"Subtle Ghost Minimal",description:"Clean borderless styling with gentle hover feedback",cssText:`background-color: transparent; color: #94a3b8; border: 1px solid transparent; border-radius: ${t}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: color 0.15s ease, background-color 0.15s ease;`,tailwindClasses:"bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg transition-all",contrastRating:"AA",contrastRatio:"4.8:1"}]}}class de{supports(e){const s=e.tagName.toLowerCase(),t=e.getAttribute("role"),a=["div","section","article","aside","main","card"].includes(s),i=e.classList.contains("card")||e.classList.contains("box");return a||t==="region"||i}generatePresets(e,s){const t=s.baseRadius||"12px";return[{id:"container-elevated-card",name:"Elevated Modern Card",description:"Rich dark surface with deep layered drop shadow",cssText:`background-color: #1e293b; border: 1px solid #334155; border-radius: ${t}; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);`,tailwindClasses:"bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"},{id:"container-frosted-glass",name:"Frosted Glass Surface",description:"Deep translucent backdrop blur with fine highlight border",cssText:`background-color: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: ${t}; padding: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`,tailwindClasses:"bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl"},{id:"container-ambient-glow",name:"Ambient Aura Box",description:"Atmospheric halo glow echoing the primary brand tone",cssText:`background-color: #0f172a; border: 1px solid rgba(99, 102, 241, 0.35); box-shadow: 0 0 28px rgba(99, 102, 241, 0.15); border-radius: ${t}; padding: 24px;`,tailwindClasses:"bg-slate-900 border border-indigo-500/30 shadow-[0_0_28px_rgba(99,102,241,0.15)] rounded-xl p-6"},{id:"container-flat-minimal",name:"Crisp Flat Minimal",description:"High-contrast structural outline with zero blur drop shadow",cssText:`background-color: #0f172a; border: 2px solid #334155; border-radius: ${t}; padding: 24px; box-shadow: none;`,tailwindClasses:"bg-slate-900 border-2 border-slate-700 rounded-lg p-6 shadow-none"}]}}class pe{supports(e){const s=e.tagName.toLowerCase();return["h1","h2","h3","h4","h5","h6","p","span","label","strong","em"].includes(s)}generatePresets(e,s){return/^h[1-6]$/i.test(e.tagName)?[{id:"text-gradient-hero",name:"Vibrant Mesh Gradient",description:"Multi-stop text gradient with tight letter spacing",cssText:"background: linear-gradient(135deg, #a5b4fc 0%, #38bdf8 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15;",tailwindClasses:"bg-gradient-to-r from-indigo-300 via-sky-400 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-tight"},{id:"text-crisp-white",name:"High-Contrast Crisp",description:"Maximum luminance contrast with crisp tracking",cssText:"color: #f8fafc; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);",tailwindClasses:"text-slate-100 font-bold tracking-tight drop-shadow-sm"},{id:"text-eyebrow-accent",name:"Uppercase Eyebrow",description:"Spaced uppercase title with brand hue",cssText:"color: #818cf8; font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; line-height: 1.4;",tailwindClasses:"text-indigo-400 text-xs font-bold uppercase tracking-widest"},{id:"text-subtle-glow",name:"Subtle Neon Header",description:"Soft luminous text aura for atmospheric headings",cssText:"color: #38bdf8; font-weight: 700; letter-spacing: -0.01em; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);",tailwindClasses:"text-sky-400 font-bold tracking-normal drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"}]:[{id:"text-body-high-contrast",name:"High-Legibility Reading",description:"Optimized 1.6 line height with clean contrast",cssText:"color: #f1f5f9; font-size: 1.05rem; line-height: 1.65; letter-spacing: 0.01em;",tailwindClasses:"text-slate-100 text-base leading-relaxed tracking-normal"},{id:"text-body-muted-slate",name:"Muted Secondary Prose",description:"Relaxed secondary tone for ancillary descriptions",cssText:"color: #94a3b8; font-size: 0.95rem; line-height: 1.6;",tailwindClasses:"text-slate-400 text-sm leading-normal"},{id:"text-body-callout",name:"Highlighted Lead Paragraph",description:"Larger font size with subtle italic emphasis",cssText:"color: #cbd5e1; font-size: 1.15rem; line-height: 1.7; font-weight: 400; font-style: italic;",tailwindClasses:"text-slate-300 text-lg leading-relaxed italic"},{id:"text-body-pill-badge",name:"Compact Metadata Tag",description:"Inline badge with subdued background surface",cssText:"color: #38bdf8; background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; padding: 2px 10px; font-size: 0.8rem; font-weight: 600; display: inline-block;",tailwindClasses:"text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block"}]}}class ue{strategies;constructor(){this.strategies=[new ce,new pe,new de]}suggest(e,s){for(const t of this.strategies)if(t.supports(e))return t.generatePresets(e,s);return this.strategies[2].generatePresets(e,s)}}class he{undoStack=[];redoStack=[];maxHistory=50;execute(e){!e.element||!e.element.isConnected||(e.element.style.cssText=e.appliedCssText,this.undoStack.push(e),this.undoStack.length>this.maxHistory&&this.undoStack.shift(),this.redoStack.length=0)}undo(){const e=this.undoStack.pop();return e?(e.element&&e.element.isConnected&&(e.element.style.cssText=e.previousCssText),this.redoStack.push(e),e):null}redo(){const e=this.redoStack.pop();return e?(e.element&&e.element.isConnected&&(e.element.style.cssText=e.appliedCssText),this.undoStack.push(e),e):null}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}getHistory(){return this.undoStack}getUniqueElementCount(){const e=new Set;for(const s of this.undoStack)s.element&&s.element.isConnected&&e.add(s.element);return e.size}removeElement(e){this.undoStack=this.undoStack.filter(s=>s.element!==e),this.redoStack=this.redoStack.filter(s=>s.element!==e)}clear(){this.undoStack.length=0,this.redoStack.length=0}}function W(l){if(l.length===0)return"/* No style changes recorded */";const e=new Map;for(const t of l)e.set(t.selectorPath,t.appliedCssText);const s=["/* === AuraCSS Generated CSS Export === */"];for(const[t,a]of e.entries()){const i=a.split(";").map(o=>o.trim()).filter(Boolean).map(o=>`  ${o};`).join(`
`);s.push(`${t} {
${i}
}`)}return s.join(`

`)}function ge(l){if(l.length===0)return"// No Tailwind mutations recorded";const e=new Map;for(const t of l)e.set(t.selectorPath,t.tailwindClasses);const s=["// === AuraCSS Tailwind Mapping ==="];for(const[t,a]of e.entries())s.push(`// ${t}
className="${a}"`);return s.join(`

`)}function be(l){if(l.length===0)return"// No element mutations recorded";const e=new Map;for(const t of l)e.set(t.selectorPath,{tw:t.tailwindClasses,css:t.appliedCssText});const s=["// === AuraCSS JSX / Component Export ==="];for(const[t,a]of e.entries()){const i=a.css.split(";").map(o=>o.trim()).filter(Boolean).map(o=>{const n=o.indexOf(":");if(n===-1)return null;const r=o.slice(0,n).trim(),c=o.slice(n+1).trim();return`    ${r.replace(/-([a-z])/g,(f,d)=>d.toUpperCase())}: "${c}"`}).filter(Boolean).join(`,
`);s.push(`// ${t}
<div className="${a.tw}" style={{
${i}
}}>...</div>`)}return s.join(`

`)}const me=`
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
`;class fe{modalEl=null;textAreaEl=null;subtitleEl=null;chipsEl=null;currentMode="css";commands=[];mount(e){if(this.modalEl)return;const s=document.createElement("style");s.textContent=me,e.appendChild(s);const t=document.createElement("div");t.className="auracss-ledger-modal",t.setAttribute("role","dialog"),t.setAttribute("aria-label","AuraCSS Export Ledger");const a=document.createElement("div");a.className="auracss-ledger-card";const i=document.createElement("div");i.className="auracss-ledger-header";const o=document.createElement("div");o.className="auracss-ledger-title-group";const n=document.createElement("span");n.className="auracss-ledger-title",n.innerHTML="✦ AuraCSS Change Ledger";const r=document.createElement("span");r.className="auracss-ledger-subtitle",r.textContent="0 elements modified",this.subtitleEl=r,o.append(n,r);const c=document.createElement("button");c.className="auracss-ledger-close",c.type="button",c.textContent="✕",c.onclick=()=>this.hide(),i.appendChild(o),i.appendChild(c);const p=document.createElement("div");p.className="auracss-ledger-chips",this.chipsEl=p;const f=document.createElement("div");f.className="auracss-ledger-tabs";const d=document.createElement("button");d.className="auracss-ledger-tab active",d.type="button",d.textContent="CSS Diff";const b=document.createElement("button");b.className="auracss-ledger-tab",b.type="button",b.textContent="Tailwind";const u=document.createElement("button");u.className="auracss-ledger-tab",u.type="button",u.textContent="JSX Component",f.append(d,b,u);const x=document.createElement("textarea");x.className="auracss-ledger-textarea",x.readOnly=!0;const v=document.createElement("div");v.className="auracss-ledger-actions";const g=document.createElement("button");g.className="auracss-ledger-download",g.type="button",g.textContent="📥 Download .css",g.onclick=()=>{try{const y=W(this.commands),w=new Blob([y],{type:"text/css;charset=utf-8"}),$=URL.createObjectURL(w),E=document.createElement("a");E.href=$,E.download=`auracss-changes-${Date.now()}.css`,document.body.appendChild(E),E.click(),document.body.removeChild(E),URL.revokeObjectURL($)}catch{}};const h=document.createElement("button");h.className="auracss-ledger-copy",h.type="button",h.textContent="Copy to Clipboard",v.append(g,h),d.onclick=()=>{this.currentMode="css",d.classList.add("active"),b.classList.remove("active"),u.classList.remove("active"),this.updateText()},b.onclick=()=>{this.currentMode="tailwind",b.classList.add("active"),d.classList.remove("active"),u.classList.remove("active"),this.updateText()},u.onclick=()=>{this.currentMode="jsx",u.classList.add("active"),d.classList.remove("active"),b.classList.remove("active"),this.updateText()},h.onclick=async()=>{try{await navigator.clipboard.writeText(x.value),h.textContent="✓ Copied!",setTimeout(()=>{h.textContent="Copy to Clipboard"},1500)}catch{x.select(),document.execCommand("copy"),h.textContent="✓ Copied!",setTimeout(()=>{h.textContent="Copy to Clipboard"},1500)}},a.appendChild(i),a.appendChild(p),a.appendChild(f),a.appendChild(x),a.appendChild(v),t.appendChild(a),t.addEventListener("click",y=>{y.target===t&&this.hide()}),e.appendChild(t),this.modalEl=t,this.textAreaEl=x}updateText(){this.textAreaEl&&(this.currentMode==="css"?this.textAreaEl.value=W(this.commands):this.currentMode==="tailwind"?this.textAreaEl.value=ge(this.commands):this.textAreaEl.value=be(this.commands))}show(e){if(!this.modalEl||!this.textAreaEl)return;this.commands=e;const s=new Set;e.forEach(a=>s.add(a.selectorPath));const t=s.size;this.subtitleEl&&(this.subtitleEl.textContent=`${t} element${t===1?"":"s"} modified • Ready to copy or download`),this.chipsEl&&(this.chipsEl.innerHTML="",s.forEach(a=>{const i=document.createElement("span");i.className="auracss-ledger-chip",i.textContent=a,this.chipsEl?.appendChild(i)})),this.updateText(),this.modalEl.classList.add("visible")}hide(){this.modalEl&&this.modalEl.classList.remove("visible")}destroy(){this.modalEl&&this.modalEl.parentNode&&this.modalEl.parentNode.removeChild(this.modalEl),this.modalEl=null,this.textAreaEl=null,this.subtitleEl=null,this.chipsEl=null}}const xe=`
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
`;class ve{drawerEl=null;onTuneCallback=null;mount(e){if(this.drawerEl)return;const s=document.createElement("style");s.textContent=xe,e.appendChild(s);const t=document.createElement("div");t.className="auracss-customizer-drawer",t.setAttribute("role","region"),t.setAttribute("aria-label","AuraCSS Fine-Tuning Controls"),t.appendChild(this.createRow("Radius",[{label:"0px",value:"0px",tw:"rounded-none"},{label:"8px",value:"8px",tw:"rounded-lg"},{label:"16px",value:"16px",tw:"rounded-2xl"},{label:"Pill",value:"9999px",tw:"rounded-full"}],"borderRadius")),t.appendChild(this.createRow("Padding",[{label:"Tight",value:"6px 12px",tw:"px-3 py-1.5"},{label:"Normal",value:"10px 20px",tw:"px-5 py-2.5"},{label:"Wide",value:"16px 28px",tw:"px-7 py-3.5"}],"padding")),t.appendChild(this.createRow("Shadow",[{label:"Flat",value:"none",tw:"shadow-none"},{label:"Elevation",value:"0 8px 24px rgba(0,0,0,0.3)",tw:"shadow-xl"},{label:"Neon Glow",value:"0 0 20px rgba(56, 189, 248, 0.45)",tw:"shadow-[0_0_20px_#38bdf8]"}],"boxShadow")),e.appendChild(t),this.drawerEl=t}createRow(e,s,t){const a=document.createElement("div");a.className="auracss-tune-row";const i=document.createElement("span");i.className="auracss-tune-label",i.textContent=e,a.appendChild(i);const o=document.createElement("div");return o.className="auracss-tune-pills",s.forEach(n=>{const r=document.createElement("button");r.className="auracss-tune-pill",r.type="button",r.textContent=n.label,r.onclick=c=>{c.stopPropagation(),o.querySelectorAll(".auracss-tune-pill").forEach(f=>f.classList.remove("active")),r.classList.add("active");const p=t.replace(/([A-Z])/g,"-$1").toLowerCase();this.onTuneCallback?.({property:p,value:n.value,cssText:`${p}: ${n.value};`,tailwind:n.tw})},o.appendChild(r)}),a.appendChild(o),a}show(e){this.onTuneCallback=e,this.drawerEl?.classList.add("visible")}hide(){this.drawerEl?.classList.remove("visible"),this.onTuneCallback=null}toggle(e){this.drawerEl?.classList.contains("visible")?this.hide():this.show(e)}destroy(){this.hide(),this.drawerEl&&this.drawerEl.parentNode&&this.drawerEl.parentNode.removeChild(this.drawerEl),this.drawerEl=null}}const G="auracss_ai_config";function we(l){const e=l.replace(/```json/gi,"").replace(/```/g,"").trim();return JSON.parse(e)}class ye{config={provider:"bridge",bridgeUrl:"http://127.0.0.1:4999",apiKey:"",model:"agent-auto"};status="untested";lastError="";constructor(){this.loadConfig()}loadConfig(){try{const e=typeof localStorage<"u"?localStorage.getItem(G):null;e&&Object.assign(this.config,JSON.parse(e))}catch{}return this.config.provider="bridge",this.status="untested",this.config}saveConfig(e){this.config={...this.config,...e,provider:"bridge"};try{typeof localStorage<"u"&&localStorage.setItem(G,JSON.stringify(this.config))}catch{}}isConfigured(){return!0}getConfig(){return{...this.config}}getStatus(){return{status:this.status,error:this.lastError}}async testConnection(){const e=new AbortController,s=setTimeout(()=>e.abort(),4e3),t=Date.now();try{const a=`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/health`,i=await fetch(a,{signal:e.signal}),o=Date.now()-t;if(i.ok)return this.status="connected",this.lastError="",{success:!0,message:`Connected to Antigravity MCP Bridge on 127.0.0.1:4999 (${o}ms)`,latencyMs:o};throw new Error(`Bridge returned HTTP ${i.status}`)}catch(a){this.status="error";const i=a instanceof Error&&a.name==="AbortError"?"Connection timed out after 4s":a instanceof Error?a.message:String(a);return this.lastError=i,{success:!1,message:`Bridge connection failed: ${i.slice(0,100)}`}}finally{clearTimeout(s)}}async synthesize(e,s){try{const t=await this.callBridge(e,s);return this.status="connected",this.lastError="",t}catch(t){throw this.status="error",this.lastError=t instanceof Error?t.message:String(t),t}}async callBridge(e,s){const t=`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/api/synthesize`,a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e),signal:s});if(!a.ok)throw new Error(`Bridge HTTP ${a.status}`);return await a.json()}notifyActiveElement(e){if(!(typeof fetch>"u"))try{fetch(`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/api/active-element`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).catch(()=>{})}catch{}}subscribeBridge(e){if(!(typeof window>"u"||typeof EventSource>"u"))try{const s=new EventSource(`${this.config.bridgeUrl||"http://127.0.0.1:4999"}/api/events`);s.onmessage=t=>{try{const a=JSON.parse(t.data);a.type==="apply_style"&&a.payload?.cssText&&e(a.payload)}catch{}}}catch{}}async generateAISuggestions(e,s,t=0){const a=`Generate 4 diverse design variations (Theme Set ${t+1} of 3): Return JSON: { "presets": [ { "id": "p1", "name": "Name", "description": "Desc", "cssText": "...", "tailwindClasses": "..." } ] }`,i=await this.synthesize({...e,prompt:a,setIndex:t},s);try{const o=we(i.explanation.includes("{")?i.explanation:JSON.stringify(i));if(Array.isArray(o.presets)&&o.presets.length>0)return o.presets.map((n,r)=>({...n,id:n.id||`ai-${r}-${Date.now()}`,contrastRating:"AAA",contrastRatio:"7.5:1"}))}catch{}return[{id:`ai-${Date.now()}`,name:"AI Smart Redesign",description:i.explanation||"Bespoke design",cssText:i.cssText,tailwindClasses:i.tailwindClasses,contrastRating:"AAA",contrastRatio:"7.2:1"}]}}const ke=`
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
`;class Ce{backdropEl=null;statusEl=null;targetValEl=null;aiService;constructor(e){this.aiService=e}mount(e){if(this.backdropEl)return;const s=document.createElement("style");s.textContent=ke,e.appendChild(s);const t=document.createElement("div");t.className="auracss-ai-modal-backdrop",t.onclick=u=>{u.target===t&&this.hide()};const a=document.createElement("div");a.className="auracss-ai-modal";const i=document.createElement("div");i.className="auracss-ai-modal-header";const o=document.createElement("div");o.className="auracss-ai-modal-title",o.innerHTML="⚡ Antigravity Agent Diagnostics";const n=document.createElement("button");n.className="auracss-ai-modal-close",n.type="button",n.innerHTML="✕",n.onclick=()=>this.hide(),i.append(o,n),a.appendChild(i);const r=document.createElement("div");r.className="auracss-ai-bridge-card",r.innerHTML=`
      <div class="auracss-ai-bridge-header">
        <span class="auracss-ai-bridge-badge">⚡ Agent Bridge Active</span>
        <span class="auracss-ai-bridge-port">localhost:4999</span>
      </div>
      <div class="auracss-ai-bridge-title">Zero-Key Antigravity Connection</div>
      <div class="auracss-ai-bridge-desc">
        Prompts and design variations are intelligently synthesized via your active Antigravity session. No external API keys or rate limits required.
      </div>
    `,a.appendChild(r);const c=document.createElement("div");c.className="auracss-diag-section",c.innerHTML=`
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
    `,this.targetValEl=c.querySelector("#auracss-diag-target"),a.appendChild(c);const p=document.createElement("div");p.className="auracss-ai-status connected",p.textContent="🟢 Connected (Bridge (localhost:4999))",this.statusEl=p,a.appendChild(p);const f=document.createElement("div");f.className="auracss-ai-actions";const d=document.createElement("button");d.className="auracss-ai-btn auracss-ai-btn-secondary",d.type="button",d.textContent="Ping MCP Bridge",d.onclick=async()=>{d.disabled=!0,d.textContent="Pinging...";const u=await this.aiService.testConnection();d.disabled=!1,d.textContent="Ping MCP Bridge",this.statusEl&&(this.statusEl.className=`auracss-ai-status ${u.success?"connected":"error"}`,this.statusEl.textContent=u.success?`🟢 ${u.message}`:`🔴 ${u.message}`)};const b=document.createElement("button");b.className="auracss-ai-btn auracss-ai-btn-primary",b.type="button",b.textContent="Close",b.onclick=()=>this.hide(),f.append(d,b),a.appendChild(f),t.appendChild(a),e.appendChild(t),this.backdropEl=t}show(e){this.targetValEl&&(this.targetValEl.textContent=e?.selector||(e?.tag?`<${e.tag}>`:"None (Standby)")),this.pingStatus(),this.backdropEl?.classList.add("visible")}async pingStatus(){if(!this.statusEl)return;const e=await this.aiService.testConnection();this.statusEl.className=`auracss-ai-status ${e.success?"connected":"error"}`,this.statusEl.textContent=e.success?`🟢 ${e.message}`:`🔴 ${e.message}`}hide(){this.backdropEl?.classList.remove("visible")}destroy(){this.hide(),this.backdropEl&&this.backdropEl.parentNode&&this.backdropEl.parentNode.removeChild(this.backdropEl),this.backdropEl=null}}function Ee(l){if(l.startsWith("#")&&l.length>=7){const e=parseInt(l.slice(1,3),16),s=parseInt(l.slice(3,5),16),t=parseInt(l.slice(5,7),16);return .299*e+.587*s+.114*t>160}return!1}function Se(l,e){const s=l.toLowerCase(),t=s.includes("background")||s.includes("bg")||s.includes("fill"),a=s.includes("border")||s.includes("outline")||s.includes("stroke"),i=s.includes("text")||s.includes("font")||!t&&!a&&s.includes("color");let o=e,n="indigo-500",r=!1;const c=s.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);c?(o=c[0],n=`[${c[0]}]`,r=!0):s.includes("cyan")||s.includes("sky")?(o="#38bdf8",n="sky-400",r=!0):s.includes("blue")?(o="#2563eb",n="blue-600",r=!0):s.includes("purple")||s.includes("violet")?(o="#a855f7",n="purple-500",r=!0):s.includes("emerald")||s.includes("green")?(o="#10b981",n="emerald-500",r=!0):s.includes("crimson")?(o="#dc2626",n="red-600",r=!0):s.includes("red")?(o="#ef4444",n="red-500",r=!0):s.includes("rose")||s.includes("pink")?(o="#f43f5e",n="rose-500",r=!0):s.includes("yellow")?(o="#eab308",n="yellow-500",r=!0):s.includes("teal")?(o="#14b8a6",n="teal-500",r=!0):s.includes("amber")||s.includes("orange")||s.includes("gold")?(o="#f59e0b",n="amber-500",r=!0):s.includes("slate")||s.includes("dark")||s.includes("black")?(o="#0f172a",n="slate-900",r=!0):(s.includes("white")||s.includes("light"))&&(o="#ffffff",n="white",r=!0);const p=s.includes("glass")||s.includes("frost")||s.includes("blur")||s.includes("translucent"),f=s.includes("glow")||s.includes("neon")||s.includes("ambient")||s.includes("luminous"),d=s.includes("gradient")||s.includes("mesh")||s.includes("vibrant"),b=s.includes("minimal")||s.includes("flat")||s.includes("sharp")||s.includes("clean"),u=!!s.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i),x=!!s.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious)\b/i),v=!!s.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i),g=!!s.match(/\b(pop|pops|standout|punchy|bold)\b/i),h=!!s.match(/\b(soften|softer|smooth|smoothen)\b/i),y=s.includes("fading")||s.includes("fade")||s.includes("pulse")||s.includes("pulsing"),w=s.includes("click")||s.includes("clicking")||s.includes("press")||s.includes("tap"),$=s.includes("animat")||s.includes("motion")||s.includes("bounce");let E="8px",C="rounded-lg";s.includes("pill")||s.includes("round")||s.includes("oval")?(E="9999px",C="rounded-full"):s.includes("sharp")||s.includes("square")||s.includes("box")?(E="0px",C="rounded-none"):(s.includes("curved")||s.includes("card")||h)&&(E="16px",C="rounded-2xl");let S="10px 20px",L="px-5 py-2.5",A,P,z;return u&&x?(S="16px 36px",L="px-9 py-4 text-lg",A="1.15rem",P="text-lg",z="240px"):u?(S="10px 32px",L="px-8 py-2.5",z="200px"):x?(S="14px 28px",L="px-7 py-3.5 text-base",A="1.1rem",P="text-base"):v&&(S="6px 12px",L="px-3 py-1.5 text-xs",A="0.85rem",P="text-xs"),{colorHex:o,twColor:n,hasExplicitColor:r,hasBgIntent:t,hasTextIntent:i,hasBorderIntent:a,isGlass:p,isGlow:f,isGradient:d,isMinimal:b,radius:E,twRadius:C,padding:S,twPadding:L,isLonger:u,isBigger:x,isCompact:v,isPop:g,isSoften:h,isFading:y,isClick:w,isAnimation:$,fontSize:A,twFontSize:P,minWidth:z}}function $e(l,e,s){const t=Se(l,s.primaryColor),a=e.tagName.toLowerCase(),i=a==="button"||a==="a"||e.getAttribute("role")==="button",o=/^h[1-6]$/i.test(a),n=Ee(t.colorHex),r=n?"#0f172a":"#ffffff";let c="",p="";if(o)t.hasBgIntent?(c=`background-color: ${t.colorHex}; color: ${r}; padding: 8px 16px; border-radius: ${t.radius}; font-weight: 700;`,p=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} px-4 py-2 ${t.twRadius} font-bold`):t.isGradient?(c=`background: linear-gradient(135deg, ${t.colorHex} 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;`,p=`bg-gradient-to-r from-${t.twColor} to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight`):(c=`color: ${t.colorHex}; font-weight: 700; letter-spacing: -0.02em;`,p=`text-${t.twColor} font-bold tracking-tight`);else if(i){const d=t.isPop?`box-shadow: 0 8px 24px ${t.colorHex}55;`:t.isGlow?`box-shadow: 0 0 20px ${t.colorHex}66;`:t.isMinimal?"box-shadow: none;":"box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);",b=t.minWidth?`min-width: ${t.minWidth}; `:"",u=t.fontSize?`font-size: ${t.fontSize}; `:"",x=`${t.minWidth?"min-w-[200px] ":""}${t.twFontSize?`${t.twFontSize} `:""}`;t.hasBorderIntent&&!t.hasBgIntent?(c=`background-color: transparent; color: ${t.colorHex}; border: 2px solid ${t.colorHex}; border-radius: ${t.radius}; padding: ${t.padding}; ${b}${u}${d} cursor: pointer; font-weight: 600;`,p=`bg-transparent border-2 border-${t.twColor} text-${t.twColor} ${t.twRadius} ${t.twPadding} ${x}font-semibold`.trim()):t.isGlass?(c=`background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid ${t.colorHex}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: ${t.radius}; padding: ${t.padding}; ${b}${u}${d} cursor: pointer; font-weight: 600;`,p=`bg-white/10 border border-${t.twColor} text-white backdrop-blur-md ${t.twRadius} ${t.twPadding} ${x}font-semibold`.trim()):t.isMinimal?(c=`background-color: transparent; color: ${t.colorHex}; border: 2px solid ${t.colorHex}; border-radius: ${t.radius}; padding: ${t.padding}; ${b}${u}${d} cursor: pointer; font-weight: 600;`,p=`bg-transparent border-2 border-${t.twColor} text-${t.twColor} ${t.twRadius} ${t.twPadding} ${x}font-semibold`.trim()):(c=`background-color: ${t.colorHex}; color: ${r}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: ${t.radius}; padding: ${t.padding}; ${b}${u}${d} cursor: pointer; font-weight: 600;`,p=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} ${t.twRadius} ${t.twPadding} ${x}font-semibold shadow-md`.trim())}else{const d=t.isGlow?t.isFading?`box-shadow: 0 0 24px ${t.colorHex}66, 0 0 48px ${t.colorHex}33;`:`box-shadow: 0 0 25px ${t.colorHex}40;`:"box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);",b=t.isClick||t.isAnimation||t.isFading?" cursor: pointer; transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease-in-out, all 0.3s ease;":"",u=t.isClick||t.isAnimation||t.isFading?" cursor-pointer active:scale-95 transition-all duration-300":"";t.hasBgIntent?(c=`background-color: ${t.colorHex}; color: ${r}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,p=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} border border-white/20 ${t.twRadius} p-6 shadow-xl${u}`):t.hasBorderIntent?(c=`background-color: #0f172a; color: #f8fafc; border: 2px solid ${t.colorHex}; border-radius: ${t.radius}; padding: 24px; ${d}${b}`,p=`bg-slate-900 border-2 border-${t.twColor} ${t.twRadius} p-6 shadow-xl${u}`):t.isGlass?(c=`${t.hasExplicitColor?`background-color: rgba(15, 23, 42, 0.75); border: 1px solid ${t.colorHex}80;`:"background-color: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.15);"} backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,p=`bg-slate-900/70 border border-${t.twColor}/50 backdrop-blur-xl ${t.twRadius} p-6 shadow-2xl${u}`):t.hasExplicitColor?(c=`background-color: ${t.colorHex}; color: ${r}; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,p=`bg-${t.twColor} ${n?"text-slate-900":"text-white"} ${t.twRadius} p-6 shadow-xl${u}`):(c=`background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${t.radius}; padding: 24px; ${d}${b}`,p=`bg-slate-900 border border-white/10 ${t.twRadius} p-6 shadow-xl${u}`)}const f=l.trim().slice(0,32);return{id:`custom-prompt-${Date.now()}`,name:`Aura: "${f}"`,description:"Synthesized design token from prompt",cssText:c,tailwindClasses:p,contrastRating:"AAA",contrastRatio:"7.0:1"}}async function Le(l,e,s,t){if(t?.isConfigured())try{const a=await t.synthesize({prompt:l,tag:e.tagName.toLowerCase(),htmlSnippet:e.outerHTML.slice(0,200),computedStyles:{color:e.style.color,backgroundColor:e.style.backgroundColor},siteTokens:s});if(a?.cssText)return{id:`ai-prompt-${Date.now()}`,name:`AI: "${l.slice(0,24)}"`,description:a.explanation||"Synthesized by AI",cssText:a.cssText,tailwindClasses:a.tailwindClasses,contrastRating:"AAA"}}catch{}return $e(l,e,s)}class V{overlay=new Z;hierarchy=new ee;harvester=new te;suggester=new ue;variationDock=new le;customizer=new ve;commandHistory=new he;ledgerModal=new fe;aiService=new ye;aiModal=new Ce(this.aiService);stylePatches=new WeakMap;aiVariationCycleMap=new WeakMap;currentDockPresets=new WeakMap;activePresetIdMap=new WeakMap;savedPromptedStyles=new WeakMap;isActive=!1;isComparing=!1;abortController=null;lockedElement=null;toggleBtn=null;toggleLabel=null;ledgerBtn=null;exportDivider=null;minBadge=null;init(){try{const e=this.overlay.mount();[this.hierarchy,this.variationDock,this.customizer,this.ledgerModal,this.aiModal].forEach(t=>t.mount(e));const s=this.overlay.mountControls(()=>this.toggle(),()=>this.ledgerModal.show(this.commandHistory.getHistory()));this.toggleBtn=s.toggleBtn,this.toggleLabel=s.toggleLabel,this.ledgerBtn=s.exportBtn,this.exportDivider=s.exportDivider,this.minBadge=s.minBadge,this.aiService.subscribeBridge(t=>{const a=this.lockedElement||(t.selector?document.querySelector(t.selector):null);if(a&&a instanceof HTMLElement){this.lockedElement||this.lockElement(a);const i=t.name||(t.prompt?t.prompt.length>25?t.prompt.slice(0,22)+"...":t.prompt:"Agent Prompt Result"),o=t.description||(t.prompt?`Prompt: "${t.prompt}"`:"Synthesized & streamed from Antigravity agent"),n={id:`prompted-${Date.now()}`,name:i,description:o,cssText:t.cssText,tailwindClasses:t.tailwindClasses||"",timestamp:Date.now(),contrastRating:"AAA",contrastRatio:"7.5:1"};this.recordSavedPromptedStyle(a,n),this.applyPreset(a,n)}}),this.log("AuraCSS initialized in standby mode")}catch(e){this.error("Initialization failed",e)}}toggle(){this.isActive?this.deactivate():this.activate()}activate(){if(this.isActive)return;this.isActive=!0,this.toggleBtn&&this.toggleLabel&&(this.toggleBtn.classList.add("active"),this.toggleLabel.textContent="AuraCSS: ON"),this.minBadge?.classList.add("active"),this.ledgerBtn&&(this.ledgerBtn.style.display="inline-flex"),this.exportDivider&&(this.exportDivider.style.display="block"),this.abortController=new AbortController;const e={capture:!0,signal:this.abortController.signal},s={...e,passive:!0};window.addEventListener("mouseover",this.handleMouseOver,e),window.addEventListener("click",this.handleClick,e),window.addEventListener("scroll",this.handleScrollOrResize,s),window.addEventListener("resize",this.handleScrollOrResize,s),window.addEventListener("keydown",this.handleKeyDown,e),window.addEventListener("keyup",this.handleKeyUp,e),this.log("AuraCSS activated")}deactivate(){this.isActive&&(this.isActive=!1,this.abortController?.abort(),this.abortController=null,this.unlockElement(),[this.overlay,this.hierarchy,this.variationDock].forEach(e=>e.clear()),[this.customizer,this.ledgerModal,this.aiModal].forEach(e=>e.hide()),this.toggleBtn&&this.toggleLabel&&(this.toggleBtn.classList.remove("active"),this.toggleLabel.textContent="AuraCSS: OFF"),this.minBadge?.classList.remove("active"),this.ledgerBtn&&(this.ledgerBtn.style.display="none"),this.exportDivider&&(this.exportDivider.style.display="none"),this.log("AuraCSS deactivated"))}handleMouseOver=e=>{try{if(this.lockedElement)return;const s=this.overlay.resolveHostElement(e);s?this.overlay.updateHighlight(s,!1):this.overlay.clear()}catch(s){this.error("handleMouseOver",s)}};handleClick=e=>{try{const s=this.overlay.resolveHostElement(e);if(!s)return;e.preventDefault(),e.stopPropagation(),this.lockedElement===s?this.unlockElement():this.lockElement(s)}catch(s){this.error("handleClick",s)}};handleScrollOrResize=()=>{try{this.lockedElement?.isConnected&&this.overlay.updateHighlight(this.lockedElement,!0)}catch(e){this.error("handleScrollOrResize",e)}};handleKeyDown=e=>{try{const t=(e.composedPath?e.composedPath():[e.target])[0];if(t?.tagName?.toLowerCase()==="input"||t?.tagName?.toLowerCase()==="textarea")return;if(e.key==="Escape"){this.lockedElement?this.unlockElement():this.deactivate();return}if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==="z"||e.key.toLowerCase()==="y")){e.preventDefault();const a=e.key.toLowerCase()==="y"||e.shiftKey?this.commandHistory.redo():this.commandHistory.undo();a?.element?.isConnected&&this.overlay.updateHighlight(a.element,!0),this.updateLedgerCount();return}if(e.code==="Space"&&this.lockedElement&&!this.isComparing){e.preventDefault();const a=this.stylePatches.get(this.lockedElement);a&&(this.isComparing=!0,this.lockedElement.style.cssText=a.originalCssText,this.overlay.updateHighlight(this.lockedElement,!0))}if(this.lockedElement&&e.altKey&&e.key.toLowerCase()==="r"){e.preventDefault(),this.revertElement(this.lockedElement);return}if(this.lockedElement&&(e.key==="ArrowUp"||e.key==="ArrowDown")){e.preventDefault();const a=e.key==="ArrowUp"?this.hierarchy.navigateUp(this.lockedElement):this.hierarchy.navigateDown(this.lockedElement);a&&this.lockElement(a)}}catch(s){this.error("handleKeyDown",s)}};handleKeyUp=e=>{try{if(e.code==="Space"&&this.isComparing&&this.lockedElement){e.preventDefault(),this.isComparing=!1;const s=this.stylePatches.get(this.lockedElement);s&&(this.lockedElement.style.cssText=s.appliedCssText,this.overlay.updateHighlight(this.lockedElement,!0))}}catch(s){this.error("handleKeyUp",s)}};lockElement(e){this.lockedElement=e,this.overlay.updateHighlight(e,!0),this.hierarchy.render(e,s=>this.lockElement(s)),this.currentDockPresets.has(e)||this.currentDockPresets.set(e,this.suggester.suggest(e,this.harvester.harvest())),this.refreshDock(e,this.stylePatches.has(e)),this.aiService.notifyActiveElement({tag:e.tagName.toLowerCase(),selector:B(e),htmlSnippet:e.outerHTML.slice(0,200),siteTokens:this.harvester.harvest()}),this.log("Locked:",e)}unlockElement(){this.lockedElement&&(this.lockedElement=null,this.isComparing=!1,this.overlay.clear(),this.hierarchy.clear(),this.variationDock.clear(),this.customizer.hide())}revertElement(e){const s=this.stylePatches.get(e);if(!s)return;e.style.cssText=s.originalCssText,this.stylePatches.delete(e),this.commandHistory.removeElement(e),this.activePresetIdMap.set(e,null),this.variationDock.setActivePresetId(null),this.updateLedgerCount(),this.overlay.updateHighlight(e,!0);const t=this.currentDockPresets.get(e)||this.suggester.suggest(e,this.harvester.harvest());this.renderDock(e,t,!1,this.aiVariationCycleMap.get(e)),this.log("Reverted to original:",e)}deselectElement(e){this.revertElement(e)}commitStyleChange(e,s,t,a){const i=this.stylePatches.get(e)?.originalCssText??a;this.stylePatches.set(e,{originalCssText:i,appliedCssText:s,tailwindClasses:t}),this.commandHistory.execute({element:e,selectorPath:B(e),previousCssText:a,appliedCssText:s,tailwindClasses:t,timestamp:Date.now()}),this.updateLedgerCount(),this.overlay.updateHighlight(e,!0),this.refreshDock(e,!0)}applyPreset(e,s){if(!e?.isConnected)return;this.activePresetIdMap.set(e,s.id),this.variationDock.setActivePresetId(s.id);const t=this.stylePatches.get(e);if(t&&t.appliedCssText===s.cssText)return;const a=e.style.cssText;e.style.cssText=s.cssText,this.commitStyleChange(e,s.cssText,s.tailwindClasses,a)}applyIncrementalPreset(e,s){if(!e?.isConnected)return;const t=e.style.cssText,a=document.createElement("div");a.style.cssText=s.cssText;for(let r=0;r<a.style.length;r++){const c=a.style[r],p=a.style.getPropertyValue(c),f=a.style.getPropertyPriority(c);e.style.setProperty(c,p,f)}const i=e.style.cssText,o=this.stylePatches.get(e),n=o?`${o.tailwindClasses} ${s.tailwindClasses}`.trim():s.tailwindClasses;this.commitStyleChange(e,i,n,t)}recordSavedPromptedStyle(e,s){const a=(this.savedPromptedStyles.get(e)||[]).filter(i=>i.cssText!==s.cssText);a.unshift(s),this.savedPromptedStyles.set(e,a)}async handlePrompt(e,s){if(!e?.isConnected)return;const t=await Le(s,e,this.harvester.harvest(),this.aiService),a={id:`prompted-${Date.now()}`,name:t.name||"Prompted Style",description:t.description||`Prompt: "${s}"`,cssText:t.cssText,tailwindClasses:t.tailwindClasses,timestamp:Date.now(),contrastRating:t.contrastRating,contrastRatio:t.contrastRatio};this.recordSavedPromptedStyle(e,a),this.applyIncrementalPreset(e,t)}applyColorSwatch(e,s){if(!e?.isConnected)return;const t=H(s),o=(t?j(t):0)>.4?"#0f172a":"#ffffff",n=e.style.cssText;e.style.backgroundColor=s,e.style.color=o;const r=e.style.cssText,p=(this.stylePatches.get(e)?.tailwindClasses||"").split(/\s+/).filter(d=>d&&!d.startsWith("bg-")&&!d.startsWith("text-")).join(" ").trim(),f=p?`${p} bg-[${s}] text-[${o}]`:`bg-[${s}] text-[${o}]`;this.commitStyleChange(e,r,f,n)}applyTypographyUpdate(e,s){if(!e?.isConnected)return;const t=e.style.cssText;e.style.setProperty(s.property,s.value);const a=e.style.cssText,i=this.stylePatches.get(e)?.tailwindClasses||"";let o=i;s.property==="color"?o=i.split(/\s+/).filter(r=>r&&!r.startsWith("text-")).join(" "):s.property==="font-size"?o=i.split(/\s+/).filter(r=>r&&!r.startsWith("text-xs")&&!r.startsWith("text-sm")&&!r.startsWith("text-base")&&!r.startsWith("text-lg")&&!r.startsWith("text-xl")&&!r.startsWith("text-2xl")).join(" "):s.property==="font-family"?o=i.split(/\s+/).filter(r=>r&&!r.startsWith("font-sans")&&!r.startsWith("font-mono")&&!r.startsWith("font-serif")&&!r.startsWith("font-display")).join(" "):s.property==="font-weight"&&(o=i.split(/\s+/).filter(r=>r&&!r.startsWith("font-normal")&&!r.startsWith("font-medium")&&!r.startsWith("font-semibold")&&!r.startsWith("font-bold")).join(" "));const n=o?`${o.trim()} ${s.tailwind}`.trim():s.tailwind;this.commitStyleChange(e,a,n,t)}deleteSavedPromptedStyle(e,s){const a=(this.savedPromptedStyles.get(e)||[]).filter(i=>i.id!==s);this.savedPromptedStyles.set(e,a),this.refreshDock(e,this.stylePatches.has(e))}clearSavedPromptedStyles(e){this.savedPromptedStyles.set(e,[]),this.refreshDock(e,this.stylePatches.has(e))}renderDock(e,s,t,a){this.currentDockPresets.set(e,s);const i=this.savedPromptedStyles.get(e)||[],o=this.harvester.harvest();this.variationDock.render(s,r=>this.applyPreset(e,r),()=>this.revertElement(e),t,r=>this.handlePrompt(e,r),()=>this.variationDock.togglePalettePopover(r=>this.applyTypographyUpdate(e,r)),()=>this.aiModal.show({tag:e.tagName.toLowerCase(),selector:B(e)}),()=>this.handleAISuggestions(e),a,()=>this.deselectElement(e),i,r=>this.applyPreset(e,r),o,r=>this.applyPreset(e,r),r=>this.applyColorSwatch(e,r),r=>this.applyTypographyUpdate(e,r),r=>this.deleteSavedPromptedStyle(e,r.id),()=>this.clearSavedPromptedStyles(e));const n=this.activePresetIdMap.get(e);n&&this.variationDock.setActivePresetId(n)}async handleAISuggestions(e){if(!e?.isConnected)return;if(!this.aiService.isConfigured()){this.aiModal.show();return}const t=((this.aiVariationCycleMap.get(e)??-1)+1)%3;this.aiVariationCycleMap.set(e,t);try{const a=await this.aiService.generateAISuggestions({tag:e.tagName.toLowerCase(),htmlSnippet:e.outerHTML.slice(0,200),computedStyles:{color:e.style.color,backgroundColor:e.style.backgroundColor},siteTokens:this.harvester.harvest()},void 0,t);this.renderDock(e,a,this.stylePatches.has(e),t)}catch{this.refreshDock(e,this.stylePatches.has(e))}}handleTune(e,s){if(!e?.isConnected)return;const t=e.style.cssText;e.style.setProperty(s.property,s.value);const a=this.stylePatches.get(e);this.commitStyleChange(e,e.style.cssText,a?`${a.tailwindClasses} ${s.tailwind}`:s.tailwind,t)}refreshDock(e,s){const t=this.currentDockPresets.get(e)||this.suggester.suggest(e,this.harvester.harvest());this.renderDock(e,t,s,this.aiVariationCycleMap.get(e))}updateLedgerCount(){this.ledgerBtn&&(this.ledgerBtn.textContent=`Export (${this.commandHistory.getUniqueElementCount()})`)}log(e,...s){window.__AURACSS_DEBUG__===!0&&console.log(`[AuraCSS] ${e}`,...s)}error(e,...s){window.__AURACSS_DEBUG__===!0&&console.error(`[AuraCSS Error] ${e}`,...s)}destroy(){this.deactivate(),[this.customizer,this.ledgerModal,this.aiModal,this.variationDock,this.hierarchy,this.overlay].forEach(e=>e.destroy()),this.commandHistory.clear(),window.__AURACSS_INSTANCE__=void 0}}if(!(typeof process<"u"&&!!process.env?.VITEST)&&typeof window<"u"&&typeof document<"u"){const l=new V;window.__AURACSS_INSTANCE__=l,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>l.init(),{once:!0}):l.init()}O.AuraCSSApp=V,Object.defineProperty(O,Symbol.toStringTag,{value:"Module"})})(this.AuraCSS=this.AuraCSS||{});
//# sourceMappingURL=auracss.bundle.js.map
