import"./modulepreload-polyfill-P2Xu9kJm.js";import{$ as e,A as t,B as n,C as r,F as i,H as a,I as o,L as s,M as c,N as l,Q as u,S as d,T as f,U as p,V as m,X as h,Y as g,Z as _,_ as v,a as y,at as b,b as x,c as S,ct as C,d as w,dt as T,et as ee,f as te,ft as ne,g as re,gt as ie,ht as E,i as ae,it as D,j as O,k,l as A,m as j,n as oe,nt as se,o as M,ot as ce,p as le,pt as ue,r as de,s as N,st as fe,t as pe,u as me,ut as he,v as P,vt as ge,w as _e,x as ve,y as ye,yt as F,z as be}from"./OrbitControls-CVWGQ4_p.js";import{n as xe,t as Se}from"./bvh-DU4wY5Nx.js";import{t as Ce}from"./mode-BoNFR7qg.js";import{n as we,r as Te,t as Ee}from"./crystals-CtLCwGLg.js";import{n as De,t as Oe}from"./fissures-Yo0QropY.js";var ke=13214975,I=.028,Ae=4e3,je=class{dom;camera;getTargets;anchor;enabled=!0;minDist=.03;onStroke=null;onActiveChange=null;onHoverChange=null;raycaster=Se(new he);pointer=new ge;samples=[];active=!1;hovering=!1;pulse=0;group=new n;beads;startMarker;brush;brushRing;brushDot;zAxis=new F(0,0,1);tmpMat=new h;tmpScale=new F(1,1,1);tmpQuat=new C;invAnchor=new h;zeroMat=new h().scale(new F(0,0,0));beadHigh=0;constructor(e,t,r,i,a){this.dom=e,this.camera=t,this.getTargets=i,this.anchor=a,this.group.renderOrder=10,r.add(this.group);let o=(e={})=>new u({color:ke,transparent:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,...e});this.beads=new p(new E(I,12,8),o({opacity:1}),Ae),this.beads.frustumCulled=!1,this.beads.renderOrder=11;for(let e=0;e<Ae;e++)this.beads.setMatrixAt(e,this.zeroMat);this.beads.instanceMatrix.needsUpdate=!0,this.beads.count=0,this.startMarker=new _(new E(I*1.8,16,12),o()),this.startMarker.visible=!1,this.startMarker.renderOrder=12,this.brush=new n,this.brushRing=new _(new T(.055,.078,40),o({opacity:.9,side:2})),this.brushDot=new _(new c(.015,20),o({opacity:.95,side:2})),this.brush.add(this.brushRing,this.brushDot),this.brush.visible=!1,this.brush.renderOrder=12,this.group.add(this.beads,this.startMarker,this.brush),e.addEventListener(`pointerdown`,this.onDown),window.addEventListener(`pointermove`,this.onMove),window.addEventListener(`pointerup`,this.onUp),e.addEventListener(`pointerleave`,this.onLeave)}update(e){if(this.pulse+=e,this.brush.visible){let e=1+Math.sin(this.pulse*4)*.08;this.brushRing.scale.setScalar(e),this.brushRing.material.opacity=.65+Math.sin(this.pulse*4)*.2}}setEnabled(e){this.enabled=e,e||(this.setHovering(!1),this.brush.visible=!1)}onDown=e=>{if(!this.enabled||e.button!==0)return;let t=this.pick(e);t&&(this.active=!0,this.samples=[t],this.brush.visible=!1,this.startMarker.visible=!0,this.startMarker.position.copy(t.position).addScaledVector(t.normal,I),this.updatePreview(),this.onActiveChange?.(!0))};onMove=e=>{if(this.active){let t=this.pick(e);if(!t)return;let n=this.samples[this.samples.length-1];if(t.position.distanceTo(n.position)<this.minDist)return;this.samples.push(t),this.updatePreview();return}if(!this.enabled)return;let t=this.pick(e);t?(this.setHovering(!0),this.brush.visible=!0,this.brush.position.copy(t.position).addScaledVector(t.normal,I*.6),this.brush.quaternion.setFromUnitVectors(this.zAxis,t.normal)):(this.brush.visible=!1,this.setHovering(!1))};onUp=()=>{this.active&&(this.active=!1,this.startMarker.visible=!1,this.onActiveChange?.(!1),this.samples.length>=2&&this.onStroke?.(this.samples.slice()),this.samples=[],this.clearPreview())};onLeave=()=>{this.active||(this.brush.visible=!1,this.setHovering(!1))};setHovering(e){e!==this.hovering&&(this.hovering=e,this.onHoverChange?.(e))}pick(e){let t=this.dom.getBoundingClientRect();this.pointer.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.far=1/0;let n=this.raycaster.intersectObjects(this.getTargets(),!0);for(let e of n){if(!e.face)continue;let t=e.face.normal.clone().transformDirection(e.object.matrixWorld);return this.anchor.updateWorldMatrix(!0,!1),this.invAnchor.copy(this.anchor.matrixWorld).invert(),{position:e.point.clone(),normal:t,local:e.point.clone().applyMatrix4(this.invAnchor),localNormal:t.clone().transformDirection(this.invAnchor)}}return null}updatePreview(){let e=Math.min(this.samples.length,Ae);for(let t=0;t<e;t++){let e=this.samples[t],n=e.position.clone().addScaledVector(e.normal,I*.8);this.tmpMat.compose(n,this.tmpQuat,this.tmpScale),this.beads.setMatrixAt(t,this.tmpMat)}this.beads.count=e,this.beadHigh=Math.max(this.beadHigh,e),this.beads.instanceMatrix.needsUpdate=!0}clearPreview(){for(let e=0;e<this.beadHigh;e++)this.beads.setMatrixAt(e,this.zeroMat);this.beadHigh=0,this.beads.count=0,this.beads.instanceMatrix.needsUpdate=!0}},Me={palette:`Borealis`,height:.62,wave:.55,flow:1,rays:.7,brightness:1,sparkles:140,lightSpill:.8,growthSpeed:1.2},Ne={Borealis:{hem:new l(3997608),mid:new l(3590655),top:new l(11693055)},Twilight:{hem:new l(16747202),mid:new l(10513407),top:new l(4008918)},Ember:{hem:new l(16761962),mid:new l(16738954),top:new l(9059839)}},Pe=.03,Fe=14,L=e=>M(ae(e,`float`)),Ie=e=>x(ae(e,`vec3`)),R=e=>x(e),Le=null;function Re(){if(!Le){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.3,`rgba(220,235,255,0.7)`),n.addColorStop(1,`rgba(160,190,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),Le=new O(e)}return Le}var ze=null;function Be(){return ze||=new u({map:Re(),transparent:!0,depthWrite:!1,blending:2,side:2}),ze}function Ve(e){let t=[],n=0,r=0,i=new F;for(let a=0;a<e.length;a++){if(a>0&&(n+=e[a].local.distanceTo(e[a-1].local)),n<r&&a!==e.length-1)continue;r=n+Pe;let o=e[Math.max(a-1,0)],s=e[Math.min(a+1,e.length-1)];i.subVectors(s.local,o.local),i.lengthSq()<1e-8&&i.set(1,0,0),i.normalize();let c=e[a].localNormal.clone().normalize(),l=new F().crossVectors(i,c).normalize();t.push({pos:e[a].local.clone(),normal:c,side:l,dist:n})}return t}function He(e,n){let r=e.length,i=new Float32Array(r*15*3),a=new Float32Array(r*15*3),o=new Float32Array(r*15*3),s=new Float32Array(r*15),c=new Float32Array(r*15),l=new Float32Array(r*15),u=[],d=1;for(let t=0;t<r;t++){let r=e[t];d=g.clamp(d+(n()-.5)*.22,.68,1.32);for(let e=0;e<15;e++){let n=t*15+e;i[n*3]=r.pos.x,i[n*3+1]=r.pos.y,i[n*3+2]=r.pos.z,a[n*3]=r.normal.x,a[n*3+1]=r.normal.y,a[n*3+2]=r.normal.z,o[n*3]=r.side.x,o[n*3+1]=r.side.y,o[n*3+2]=r.side.z,s[n]=r.dist,c[n]=e/Fe,l[n]=d}}for(let e=0;e<r-1;e++)for(let t=0;t<14;t++){let n=e*15+t,r=(e+1)*15+t;u.push(n,r,n+1,r,r+1,n+1)}let f=new t;return f.setAttribute(`position`,new k(i,3)),f.setAttribute(`aUp`,new k(a,3)),f.setAttribute(`aSide`,new k(o,3)),f.setAttribute(`aDist`,new k(s,1)),f.setAttribute(`aV`,new k(c,1)),f.setAttribute(`aColJit`,new k(l,1)),f.setIndex(u),f}function Ue(e){let n=e.length,r=new Float32Array(n*2*3),i=new Float32Array(n*2*3),a=new Float32Array(n*2),o=new Float32Array(n*2),s=[];for(let t=0;t<n;t++){let n=e[t];for(let e=0;e<2;e++){let s=t*2+e;r[s*3]=n.pos.x+n.normal.x*.005,r[s*3+1]=n.pos.y+n.normal.y*.005,r[s*3+2]=n.pos.z+n.normal.z*.005,i[s*3]=n.side.x,i[s*3+1]=n.side.y,i[s*3+2]=n.side.z,a[s]=e===0?-1:1,o[s]=n.dist}}for(let e=0;e<n-1;e++){let t=e*2;s.push(t,t+1,t+2,t+1,t+3,t+2)}let c=new t;return c.setAttribute(`position`,new k(r,3)),c.setAttribute(`aSide`,new k(i,3)),c.setAttribute(`aAcross`,new k(a,1)),c.setAttribute(`aDist`,new k(o,1)),c.setIndex(s),c}var We=new h,Ge=new F,Ke=new F,qe=new h().makeScale(0,0,0),Je=new l,Ye=new l,Xe=new l,Ze=class{group=new n;settings;path;total;grown=0;uGrown=P(0);uTotal=P(1);uHeight=P(.6);uWave=P(.5);uFlow=P(1);uRays=P(.7);uBright=P(1);uSpectrum=P(0);uHem=P(new l);uMid=P(new l);uTop=P(new l);curtainGeo;hemGeo;materials=[];motes=[];moteMesh;lights=[];constructor(e,t,n){this.settings={...n};let r=Ce(t);this.path=Ve(e),this.total=this.path.length?this.path[this.path.length-1].dist:0,this.uTotal.value=Math.max(this.total,.001),this.curtainGeo=He(this.path,r);let i=this.makeCurtainMaterial(0,1,1),a=this.makeCurtainMaterial(2.4,.72,.55),o=new _(this.curtainGeo,i),c=new _(this.curtainGeo,a);for(let e of[c,o])e.renderOrder=2,e.frustumCulled=!1,this.group.add(e);this.hemGeo=Ue(this.path);let l=this.makeHemMaterial(),u=new _(this.hemGeo,l);u.renderOrder=1,u.frustumCulled=!1,this.group.add(u);for(let e=0;e<240;e++){let e=this.path[Math.floor(r()*this.path.length)],t=r()**1.4;this.motes.push({base:e.pos.clone(),up:e.normal,side:e.side,v:t,dist:e.dist,size:.008+r()*.016,phase:r()*Math.PI*2,twinkle:.6+r()*2.2,colorMix:r(),quat:new C().setFromEuler(new s(r()*Math.PI,r()*Math.PI,r()*Math.PI))})}this.moteMesh=new p(new D(1,1),Be(),240);for(let e=0;e<240;e++)this.moteMesh.setMatrixAt(e,qe),this.moteMesh.setColorAt(e,Je.setRGB(0,0,0));this.moteMesh.renderOrder=3,this.moteMesh.frustumCulled=!1,this.group.add(this.moteMesh);let d=Math.min(3,Math.max(1,Math.round(this.total*1.2)));for(let e=0;e<d;e++){let t=d===1?.5:.15+.7*e/(d-1),n=this.pathAt(this.total*t),i=new b(16777215,0,1.6,2);i.position.copy(n.pos).addScaledVector(n.normal,.16),this.group.add(i),this.lights.push({light:i,dist:this.total*t,phase:r()*20,warm:e%2==1})}this.applySettings(n)}makeCurtainMaterial(e,t,n){let r=new ve;r.transparent=!0,r.depthWrite=!1,r.side=2,r.blending=2,this.materials.push(r);let i=Ie(`aUp`),a=Ie(`aSide`),o=L(`aDist`),s=L(`aV`),c=L(`aColJit`),l=v.mul(this.uFlow),u=j(0,.4,this.uGrown.sub(o)),d=this.uHeight.mul(c).mul(s).mul(u).mul(t),f=l.mul(.23).add(e).sin().mul(.2).add(.8),p=this.uWave.mul(.17).mul(s.pow(1.35)).mul(u).mul(f),m=o.mul(6.3).add(l.mul(1.1)).add(e),h=m.sin().add(o.mul(11.7).sub(l.mul(.7)).add(s.mul(1.8)).add(e).sin().mul(.5)),g=o.mul(23).add(l.mul(1.9)).add(s.mul(4)).add(e).sin().mul(.02).mul(s);r.positionNode=w.add(i.mul(d.add(g.mul(.4)))).add(a.mul(p.mul(h).add(g)));let _=de(y(m)).pow(1.6).mul(.85).add(.4),b=o.mul(36).add(l.mul(.45).sin().mul(1.6)).add(s.mul(2.2)).sin().mul(.5).add(.5),S=A(M(1),b.pow(2.4).mul(1.7).add(.25),this.uRays),C=j(0,.22,s).oneMinus().mul(1.3).add(1),T=A(R(this.uHem),R(this.uMid),j(.03,.45,s));T=A(T,R(this.uTop),j(.45,.95,s));let ee=y(x(o.mul(.9).add(l.mul(.1)),o.mul(.9).add(l.mul(.1)).add(2.09),o.mul(.9).add(l.mul(.1)).add(4.18))).mul(.5).add(.5).mul(x(.9,1,1.2));r.colorNode=A(T,ee,this.uSpectrum).mul(_).mul(S).mul(C).mul(this.uBright).mul(1.3*n);let te=j(0,.22,o.min(this.uTotal.sub(o))),ne=o.mul(17).add(s.mul(9)).add(l.mul(.8)).sin().mul(.12).add(.88);return r.opacityNode=M(1).sub(s).pow(1.15).mul(u).mul(te).mul(ne).mul(.85),r}makeHemMaterial(){let e=new ve;e.transparent=!0,e.depthWrite=!1,e.blending=2,this.materials.push(e);let t=Ie(`aSide`),n=L(`aAcross`),r=L(`aDist`),i=v.mul(this.uFlow);e.positionNode=w.add(t.mul(n.mul(this.uHeight.mul(.22).add(.05))));let a=j(0,.3,this.uGrown.sub(r)),o=j(0,.2,r.min(this.uTotal.sub(r))),s=de(n).oneMinus().max(0).pow(1.5),c=r.mul(6.3).add(i.mul(1.1)).cos().mul(.2).add(.8);return e.colorNode=A(R(this.uHem),R(this.uMid),.35).mul(s).mul(c).mul(this.uBright).mul(.5),e.opacityNode=a.mul(o),e}applySettings(e){let t=e;this.settings={...t},this.uHeight.value=t.height,this.uWave.value=t.wave,this.uFlow.value=t.flow,this.uRays.value=t.rays,this.uBright.value=t.brightness,this.uSpectrum.value=+(t.palette===`Spectrum`);let n=Ne[t.palette===`Spectrum`?`Borealis`:t.palette];this.uHem.value.copy(n.hem),this.uMid.value.copy(n.mid),this.uTop.value.copy(n.top)}update(e,t){this.grown<this.total+1&&(this.grown+=e*this.settings.growthSpeed,this.uGrown.value=this.grown),this.updateMotes(t),this.updateLights(t)}finishGrowth(){this.grown=this.total+2,this.uGrown.value=this.grown}pathAt(e){let t=g.clamp(Math.round(e/Pe),0,this.path.length-1);return this.path[t]}updateMotes(e){let t=this.settings,n=e*t.flow,r=Ne[t.palette===`Spectrum`?`Borealis`:t.palette];Ye.copy(r.hem),Xe.copy(r.top);let i=this.grown;for(let e=0;e<this.motes.length;e++){let r=this.motes[e];if(e>=t.sparkles||r.dist>i){this.moteMesh.setMatrixAt(e,qe);continue}let a=t.height*r.v*(.35+.65*Math.min((i-r.dist)/.4,1)),o=Math.sin(r.dist*6.3+n*1.1)*t.wave*.17*r.v**1.35,s=Math.sin(n*.6+r.phase)*.02;Ke.copy(r.base).addScaledVector(r.up,a+s).addScaledVector(r.side,o+Math.sin(n*.4+r.phase*1.7)*.02);let c=(.5+.5*Math.sin(n*r.twinkle*2+r.phase))**2.5;Ge.setScalar(r.size*(.7+c*.6)),We.compose(Ke,r.quat,Ge),this.moteMesh.setMatrixAt(e,We),Je.copy(Ye).lerp(Xe,r.colorMix).multiplyScalar((.25+c*1.3)*t.brightness),this.moteMesh.setColorAt(e,Je)}this.moteMesh.instanceMatrix.needsUpdate=!0,this.moteMesh.instanceColor&&(this.moteMesh.instanceColor.needsUpdate=!0)}updateLights(e){let t=Ne[this.settings.palette===`Spectrum`?`Borealis`:this.settings.palette];for(let{light:n,dist:r,phase:i,warm:a}of this.lights){if(this.grown<=r){n.intensity=0;continue}let o=g.clamp((this.grown-r)/.5,0,1),s=.72+.28*Math.sin(e*.9*this.settings.flow+i);n.color.copy(a?t.top:t.hem),n.intensity=this.settings.lightSpill*1.1*o*s}}dispose(){this.group.removeFromParent(),this.curtainGeo.dispose(),this.hemGeo.dispose();for(let e of this.materials)e.dispose();this.moteMesh.geometry.dispose(),this.moteMesh.dispose()}},Qe={id:`Aurora silk`,createStroke(e,t,n){return new Ze(e,t,n)}},$e={palette:`Abyss`,colonySize:.19,density:10,branching:.85,tendrils:9,glow:1.2,pulseSpeed:1,sway:.5,plankton:150,lightSpill:1,growthSpeed:1.1},et=3,z={Abyss:{bodyA:new l(2366014),bodyB:new l(3809102),glowA:new l(3073750),glowB:new l(5147391)},Tropic:{bodyA:new l(5116464),bodyB:new l(7215658),glowA:new l(3407784),glowB:new l(16735912)},Ghost:{bodyA:new l(2765120),bodyB:new l(3818582),glowA:new l(12577023),glowB:new l(8368383)},Toxic:{bodyA:new l(1323034),bodyB:new l(2048032),glowA:new l(9109294),glowB:new l(15138638)}},B=P(1),tt=P(1),nt=P(.5),V=P(new l(3073750)),H=P(new l(5147391)),U=e=>x(e);function rt(e){B.value=e.glow,tt.value=e.pulseSpeed,nt.value=e.sway;let t=z[e.palette];V.value.copy(t.glowA),H.value.copy(t.glowB)}function it(){return te.dot(x(1.6,1.1,1.35)).mul(2.6).sub(v.mul(tt.mul(2.1))).sin().mul(.5).add(.5).pow(2.5)}var at=null;function ot(){if(!at){let e=Ce(789105),t=new i(.55,1,1,6,3).toNonIndexed();t.translate(0,.5,0);let n=t.getAttribute(`position`),r=new Map;for(let t=0;t<n.count;t++){let i=`${n.getX(t).toFixed(3)},${n.getY(t).toFixed(3)},${n.getZ(t).toFixed(3)}`,a=r.get(i);a||(a=[(e()-.5)*.3,(e()-.5)*.12,(e()-.5)*.3],r.set(i,a)),n.setXYZ(t,n.getX(t)*(1+a[0]),n.getY(t)+a[1]*.3,n.getZ(t)*(1+a[2]))}t.computeVertexNormals(),at=t}return at}var st=null;function ct(){return st||=new a(1,1),st}var lt=null;function ut(){if(!lt){let e=new i(.06,1,1,5,6);e.translate(0,.5,0),lt=e}return lt}var dt=null;function ft(){if(!dt){let e=new D(1.4,1,6,6);e.translate(0,.5,0),dt=e}return dt}function pt(){let e=document.createElement(`canvas`);e.width=256,e.height=256;let t=e.getContext(`2d`),n=Ce(387834);t.fillStyle=`rgba(70,70,70,0.28)`,t.beginPath(),t.moveTo(128,252),t.bezierCurveTo(20,210,4,120,30,40),t.bezierCurveTo(80,8,176,8,226,40),t.bezierCurveTo(252,120,236,210,128,252),t.closePath(),t.fill();let r=(e,i,a,o,s,c)=>{if(c>4||o<8)return;let l=e+Math.cos(a)*o,u=i-Math.sin(a)*o;t.strokeStyle=`rgba(235,235,235,${.95-c*.12})`,t.lineWidth=s,t.beginPath(),t.moveTo(e,i),t.lineTo(l,u),t.stroke();let d=c<2?3:2;for(let e=0;e<d;e++)r(l,u,a+(n()-.5)*1.1,o*(.62+n()*.2),Math.max(s*.62,.8),c+1)};for(let e=0;e<5;e++)r(128,252,Math.PI/2+(e-2)*.42+(n()-.5)*.2,60+n()*26,3.2,0);let i=new O(e);return i.anisotropy=4,i}var mt=null;function ht(){return mt||=new ee({color:16777215,roughness:.85,metalness:.05,envMapIntensity:.4}),mt}var gt=null;function _t(){if(!gt){let e=new ve,t=v.mul(.8).add(N(S).mul(6.283)).sin().mul(.15).add(.85);e.colorNode=A(U(V),U(H),N(S.add(9))).mul(it().mul(2.6).add(.2)).mul(t).mul(B),gt=e}return gt}var vt=null;function yt(){if(!vt){let e=new d;e.roughness=.7;let t=w.y.clamp(0,1).pow(2),n=N(S).mul(6.283),r=x(v.mul(.9).add(n).sin(),M(0),v.mul(.7).add(n.mul(1.6)).sin()).mul(t).mul(nt).mul(.35);e.positionNode=w.add(r);let i=A(U(V),U(H),N(S.add(5)));e.colorNode=x(.06,.05,.1),e.emissiveNode=i.mul(w.y.clamp(0,1).pow(2.5)).mul(it().mul(1.6).add(.25)).mul(B),vt=e}return vt}var bt=null;function xt(){if(!bt){let e=new d;e.side=2,e.roughness=.8;let t=re(pt()),n=w.y.clamp(0,1).pow(1.6),r=N(S).mul(6.283),i=x(v.mul(.55).add(r).sin(),M(0),v.mul(.4).add(r.mul(1.4)).sin()).mul(n).mul(nt).mul(.16);e.positionNode=w.add(i);let a=A(U(V),U(H),N(S.add(3)));e.colorNode=x(.07,.06,.11),e.emissiveNode=a.mul(t.r).mul(it().mul(1.4).add(.3)).mul(B).mul(.9),e.opacityNode=t.a,e.alphaTestNode=M(.4),bt=e}return bt}var St=null;function Ct(){if(!St){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.3,`rgba(210,245,255,0.7)`),n.addColorStop(1,`rgba(140,220,255,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),St=new u({map:new O(e),transparent:!0,depthWrite:!1,blending:2,side:2})}return St}var W=new h,G=new F,K=new F,q=new C,J=new F,wt=new F,Y=new F,X=new h().makeScale(0,0,0),Z=new l,Tt=new l,Et=new l,Dt=new F(0,1,0);function Ot(e){let t=e-1;return 1+2.20158*t*t*t+1.20158*t*t}var kt=class{group=new n;settings;total;grown=0;structuresDone=!1;segments=[];tips=[];tendrils=[];fans=[];plankton=[];segMesh;tipMesh;tendrilMesh;fanMesh;planktonMesh;lights=[];constructor(e,t,n){this.settings={...n};let r=Ce(t);this.total=this.scatter(e,r);let i=(e,t,n,r)=>{let i=new p(e,t,Math.max(n,1));i.castShadow=r,i.receiveShadow=r,i.frustumCulled=!1;for(let e=0;e<n;e++)i.setMatrixAt(e,X);return i.count=Math.max(n,1),i.instanceMatrix.needsUpdate=!0,this.group.add(i),i};this.segMesh=i(ot(),ht(),this.segments.length,!0),this.tipMesh=i(ct(),_t(),this.tips.length,!1),this.tendrilMesh=i(ut(),yt(),this.tendrils.length,!1),this.fanMesh=i(ft(),xt(),this.fans.length,!1),this.planktonMesh=i(new D(1,1),Ct(),220,!1),this.planktonMesh.renderOrder=3;for(let e=0;e<this.segments.length;e++){let t=z[n.palette];Z.copy(t.bodyA).lerp(t.bodyB,this.segments[e].bodyMix),this.segMesh.setColorAt(e,Z)}this.segMesh.instanceColor&&(this.segMesh.instanceColor.needsUpdate=!0);let a=Math.min(3,Math.max(1,Math.round(this.total*1.2)));for(let t=0;t<a;t++){let n=a===1?.5:.15+.7*t/(a-1),i=Math.floor((e.length-1)*n),o=new b(3073750,0,1.4,2);o.position.copy(e[i].local).addScaledVector(e[i].localNormal,.12),this.group.add(o),this.lights.push({light:o,dist:this.total*n,phase:r()*20})}this.applySettings(n)}scatter(e,t){let n=1/14,r=0,i=n*.4,a=new F;for(let o=0;o<e.length;o++){if(o>0&&(r+=e[o].local.distanceTo(e[o-1].local)),r<i)continue;i=r+n*(.8+t()*.4);let c=e[Math.max(o-1,0)],l=e[Math.min(o+1,e.length-1)];a.subVectors(l.local,c.local).normalize();let u=e[o].localNormal.clone().normalize(),d=new F().crossVectors(a,u).normalize(),f=t(),p=t();p<.55?this.growCoral(e[o].local,u,d,r,f,t):p<.8?this.growAnemone(e[o].local,u,d,r,f,t):this.growFan(e[o].local,u,d,a,r,f,t);let m=4+Math.floor(t()*4);for(let n=0;n<m&&this.plankton.length<220;n++)this.plankton.push({center:e[o].local.clone(),up:u,side:d,radius:.06+t()*.3,height:.06+t()*.4,speed:(.15+t()*.35)*(t()<.5?1:-1),phase:t()*Math.PI*2,size:.006+t()*.012,colorMix:t(),dist:r,quat:new C().setFromEuler(new s(t()*Math.PI,t()*Math.PI,t()*Math.PI))})}return r}growCoral(e,t,n,r,i,a){let o=(t,s,c,l)=>{let u=l*(.85+a()*.3),d=.16*.62**c*(.8+a()*.4),f=new C().setFromUnitVectors(Dt,s),p=this.segments.length;this.segments.push({anchor:e,pos:t.clone(),quat:f,len:u,rad:d,depth:c,cullRnd:a(),clusterRnd:i,birth:r+c*.1+a()*.05,bodyMix:a(),visible:!0});let m=t.clone().addScaledVector(s,u);this.tips.push({segIndex:p,offset:m.clone(),size:.11*.8**c*(.8+a()*.5),birth:r+c*.1+.08});for(let e of[.55,.82])this.tips.push({segIndex:p,offset:t.clone().addScaledVector(s,u*e),size:.065*.8**c*(.7+a()*.5),birth:r+c*.1+.05+e*.05});if(c>=et)return;let h=2+ +(a()<.3);for(let e=0;e<h;e++){let e=a()*Math.PI*2,t=.4+a()*.55;wt.copy(n),Y.crossVectors(s,wt).normalize(),J.copy(s).multiplyScalar(Math.cos(t)).addScaledVector(wt,Math.cos(e)*Math.sin(t)).addScaledVector(Y,Math.sin(e)*Math.sin(t)).normalize(),o(m,J.clone(),c+1,l*.68)}},s=t.clone();Y.crossVectors(t,n),s.addScaledVector(n,(a()-.5)*.5).addScaledVector(Y,(a()-.5)*.5).normalize(),o(new F(0,0,0),s,0,1)}growAnemone(e,t,n,r,i,a){Y.crossVectors(t,n);for(let o=0;o<14;o++){let s=a()*Math.PI*2,c=.15+a()*.7;J.copy(t).multiplyScalar(Math.cos(c)).addScaledVector(n,Math.cos(s)*Math.sin(c)).addScaledVector(Y,Math.sin(s)*Math.sin(c)).normalize();let l=new C().setFromUnitVectors(Dt,J);q.setFromAxisAngle(J,a()*Math.PI*2),l.premultiply(q),this.tendrils.push({pos:e.clone().addScaledVector(n,(a()-.5)*.05).addScaledVector(Y,(a()-.5)*.05),quat:l,len:.55+a()*.6,rank:o,clusterRnd:i,birth:r+a()*.12,visible:!0})}}growFan(e,t,n,r,i,a,o){let s=new h().makeBasis(r.clone(),t.clone(),new F().crossVectors(r,t)),c=new C().setFromRotationMatrix(s);q.setFromAxisAngle(t,(o()-.5)*.8),c.premultiply(q),this.fans.push({pos:e.clone(),quat:c,size:1+o()*.8,clusterRnd:a,birth:i+.05,visible:!0})}applySettings(e){let t=e;this.settings={...t},rt(t);let n=t.density/14,r=t.branching*4+.5;for(let e of this.segments)e.visible=e.clusterRnd<=n&&(e.depth===0||e.cullRnd<r-e.depth);for(let e of this.tendrils)e.visible=e.clusterRnd<=n&&e.rank<t.tendrils;for(let e of this.fans)e.visible=e.clusterRnd<=n;let i=z[t.palette];for(let e=0;e<this.segments.length;e++)Z.copy(i.bodyA).lerp(i.bodyB,this.segments[e].bodyMix),this.segMesh.setColorAt(e,Z);this.segMesh.instanceColor&&(this.segMesh.instanceColor.needsUpdate=!0),this.structuresDone=!1,this.pose(!0)}update(e,t){this.grown<this.total+1.2&&(this.grown+=e*this.settings.growthSpeed),this.structuresDone||this.pose(!1),this.updatePlankton(t),this.updateLights(t)}finishGrowth(){this.grown=this.total+2,this.pose(!0)}pose(e){let t=.35,n=this.settings.colonySize,r=this.grown>=this.total+t+.6,i=e;for(let a=0;a<this.segments.length;a++){let o=this.segments[a];if(!o.visible){e&&this.segMesh.setMatrixAt(a,X);continue}let s=(this.grown-o.birth)/t;if(s<=0){e&&this.segMesh.setMatrixAt(a,X),r=!1;continue}let c=s>=1?1:Ot(s);(s<1.2||e)&&(K.copy(o.anchor).addScaledVector(o.pos,n),G.set(o.rad*n*(.7+.3*c),o.len*n*c,o.rad*n*(.7+.3*c)),W.compose(K,o.quat,G),this.segMesh.setMatrixAt(a,W),i=!0,s<1&&(r=!1))}i&&(this.segMesh.instanceMatrix.needsUpdate=!0),i=e;for(let a=0;a<this.tips.length;a++){let o=this.tips[a],s=this.segments[o.segIndex];if(!s.visible){e&&this.tipMesh.setMatrixAt(a,X);continue}let c=(this.grown-o.birth)/t;if(c<=0){e&&this.tipMesh.setMatrixAt(a,X),r=!1;continue}let l=c>=1?1:Ot(c);(c<1.2||e)&&(K.copy(s.anchor).addScaledVector(o.offset,n),G.setScalar(o.size*n*l),W.compose(K,q.identity(),G),this.tipMesh.setMatrixAt(a,W),i=!0,c<1&&(r=!1))}i&&(this.tipMesh.instanceMatrix.needsUpdate=!0),i=e;for(let a=0;a<this.tendrils.length;a++){let o=this.tendrils[a];if(!o.visible){e&&this.tendrilMesh.setMatrixAt(a,X);continue}let s=(this.grown-o.birth)/t;if(s<=0){e&&this.tendrilMesh.setMatrixAt(a,X),r=!1;continue}let c=s>=1?1:Ot(s);if(s<1.2||e){let e=o.len*n*1.4;G.set(.055*n,e*c,.055*n),W.compose(o.pos,o.quat,G),this.tendrilMesh.setMatrixAt(a,W),i=!0,s<1&&(r=!1)}}i&&(this.tendrilMesh.instanceMatrix.needsUpdate=!0),i=e;for(let a=0;a<this.fans.length;a++){let o=this.fans[a];if(!o.visible){e&&this.fanMesh.setMatrixAt(a,X);continue}let s=(this.grown-o.birth)/t;if(s<=0){e&&this.fanMesh.setMatrixAt(a,X),r=!1;continue}let c=s>=1?1:Ot(s);(s<1.2||e)&&(G.setScalar(o.size*n*c),W.compose(o.pos,o.quat,G),this.fanMesh.setMatrixAt(a,W),i=!0,s<1&&(r=!1))}i&&(this.fanMesh.instanceMatrix.needsUpdate=!0),r&&(this.structuresDone=!0)}updatePlankton(e){let t=this.settings,n=z[t.palette];Tt.copy(n.glowA),Et.copy(n.glowB);for(let n=0;n<this.plankton.length;n++){let r=this.plankton[n];if(n>=t.plankton||r.dist>this.grown){this.planktonMesh.setMatrixAt(n,X);continue}let i=e*r.speed+r.phase;Y.crossVectors(r.up,r.side),K.copy(r.center).addScaledVector(r.side,Math.cos(i)*r.radius).addScaledVector(Y,Math.sin(i)*r.radius).addScaledVector(r.up,r.height+Math.sin(e*.5+r.phase*2)*.04);let a=(.5+.5*Math.sin(e*(1.2+r.phase%1.5)*2+r.phase))**2.5;G.setScalar(r.size*(.7+a*.6)),W.compose(K,r.quat,G),this.planktonMesh.setMatrixAt(n,W),Z.copy(Tt).lerp(Et,r.colorMix).multiplyScalar((.2+a*1.2)*t.glow),this.planktonMesh.setColorAt(n,Z)}this.planktonMesh.instanceMatrix.needsUpdate=!0,this.planktonMesh.instanceColor&&(this.planktonMesh.instanceColor.needsUpdate=!0)}updateLights(e){let t=z[this.settings.palette];for(let{light:n,dist:r,phase:i}of this.lights){if(this.grown<=r){n.intensity=0;continue}let a=g.clamp((this.grown-r)/.5,0,1),o=.7+.3*Math.sin(e*.8*this.settings.pulseSpeed+i);n.color.copy(t.glowA),n.intensity=this.settings.lightSpill*1.1*a*o}}dispose(){this.group.removeFromParent(),this.planktonMesh.geometry.dispose();for(let e of[this.segMesh,this.tipMesh,this.tendrilMesh,this.fanMesh,this.planktonMesh])e.dispose()}},At={id:`Bioluminescent reef`,createStroke(e,t,n){return new kt(e,t,n)}},Q=class e{constructor(t,n,r,i,a=`div`){this.parent=t,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add(`lil-controller`),this.domElement.classList.add(i),this.$name=document.createElement(`div`),this.$name.classList.add(`lil-name`),e.nextNameID=e.nextNameID||0,this.$name.id=`lil-gui-name-${++e.nextNameID}`,this.$widget=document.createElement(`div`),this.$widget.classList.add(`lil-widget`),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener(`keydown`,e=>e.stopPropagation()),this.domElement.addEventListener(`keyup`,e=>e.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle(`lil-disabled`,e),this.$disable.toggleAttribute(`disabled`,e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}options(e){let t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}},jt=class extends Q{constructor(e,t,n){super(e,t,n,`lil-boolean`,`label`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`checkbox`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener(`change`,()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}};function Mt(e){let t,n;return(t=e.match(/(#|0x)?([a-f0-9]{6})/i))?n=t[2]:(t=e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),n?`#`+n:!1}var Nt={isPrimitive:!0,match:e=>typeof e==`string`,fromHexString:Mt,toHexString:Mt},$={isPrimitive:!0,match:e=>typeof e==`number`,fromHexString:e=>parseInt(e.substring(1),16),toHexString:e=>`#`+e.toString(16).padStart(6,0)},Pt=[Nt,$,{isPrimitive:!1,match:e=>Array.isArray(e)||ArrayBuffer.isView(e),fromHexString(e,t,n=1){let r=$.fromHexString(e);t[0]=(r>>16&255)/255*n,t[1]=(r>>8&255)/255*n,t[2]=(r&255)/255*n},toHexString([e,t,n],r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return $.toHexString(i)}},{isPrimitive:!1,match:e=>Object(e)===e,fromHexString(e,t,n=1){let r=$.fromHexString(e);t.r=(r>>16&255)/255*n,t.g=(r>>8&255)/255*n,t.b=(r&255)/255*n},toHexString({r:e,g:t,b:n},r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return $.toHexString(i)}}];function Ft(e){return Pt.find(t=>t.match(e))}var It=class extends Q{constructor(e,t,n,r){super(e,t,n,`lil-color`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`color`),this.$input.setAttribute(`tabindex`,-1),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$text=document.createElement(`input`),this.$text.setAttribute(`type`,`text`),this.$text.setAttribute(`spellcheck`,`false`),this.$text.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Ft(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener(`input`,()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$text.addEventListener(`input`,()=>{let e=Mt(this.$text.value);e&&this._setValueFromHexString(e)}),this.$text.addEventListener(`focus`,()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener(`blur`,()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){let t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}},Lt=class extends Q{constructor(e,t,n){super(e,t,n,`lil-function`),this.$button=document.createElement(`button`),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener(`click`,e=>{e.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$disable=this.$button}},Rt=class extends Q{constructor(e,t,n,r,i,a){super(e,t,n,`lil-number`),this._initInput(),this.min(r),this.max(i);let o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){let e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+`%`}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),window.matchMedia(`(pointer: coarse)`).matches&&(this.$input.setAttribute(`type`,`number`),this.$input.setAttribute(`step`,`any`)),this.$widget.appendChild(this.$input),this.$disable=this.$input;let e=()=>{let e=parseFloat(this.$input.value);isNaN(e)||(this._stepExplicit&&(e=this._snap(e)),this.setValue(this._clamp(e)))},t=e=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._snapClampSetValue(t+e),this.$input.value=this.getValue())},n=e=>{e.key===`Enter`&&this.$input.blur(),e.code===`ArrowUp`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e))),e.code===`ArrowDown`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e)*-1))},r=e=>{this._inputFocused&&(e.preventDefault(),t(this._step*this._normalizeMouseWheel(e)))},i=!1,a,o,s,c,l,u=e=>{a=e.clientX,o=s=e.clientY,i=!0,c=this.getValue(),l=0,window.addEventListener(`mousemove`,d),window.addEventListener(`mouseup`,f)},d=e=>{if(i){let t=e.clientX-a,n=e.clientY-o;Math.abs(n)>5?(e.preventDefault(),this.$input.blur(),i=!1,this._setDraggingStyle(!0,`vertical`)):Math.abs(t)>5&&f()}if(!i){let t=e.clientY-s;l-=t*this._step*this._arrowKeyMultiplier(e),c+l>this._max?l=this._max-c:c+l<this._min&&(l=this._min-c),this._snapClampSetValue(c+l)}s=e.clientY},f=()=>{this._setDraggingStyle(!1,`vertical`),this._callOnFinishChange(),window.removeEventListener(`mousemove`,d),window.removeEventListener(`mouseup`,f)};this.$input.addEventListener(`input`,e),this.$input.addEventListener(`keydown`,n),this.$input.addEventListener(`wheel`,r,{passive:!1}),this.$input.addEventListener(`mousedown`,u),this.$input.addEventListener(`focus`,()=>{this._inputFocused=!0}),this.$input.addEventListener(`blur`,()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement(`div`),this.$slider.classList.add(`lil-slider`),this.$fill=document.createElement(`div`),this.$fill.classList.add(`lil-fill`),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add(`lil-has-slider`);let e=(e,t,n,r,i)=>(e-t)/(n-t)*(i-r)+r,t=t=>{let n=this.$slider.getBoundingClientRect(),r=e(t,n.left,n.right,this._min,this._max);this._snapClampSetValue(r)},n=e=>{this._setDraggingStyle(!0),t(e.clientX),window.addEventListener(`mousemove`,r),window.addEventListener(`mouseup`,i)},r=e=>{t(e.clientX)},i=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`mousemove`,r),window.removeEventListener(`mouseup`,i)},a=!1,o,s,c=e=>{e.preventDefault(),this._setDraggingStyle(!0),t(e.touches[0].clientX),a=!1},l=e=>{e.touches.length>1||(this._hasScrollBar?(o=e.touches[0].clientX,s=e.touches[0].clientY,a=!0):c(e),window.addEventListener(`touchmove`,u,{passive:!1}),window.addEventListener(`touchend`,d))},u=e=>{if(a){let t=e.touches[0].clientX-o,n=e.touches[0].clientY-s;Math.abs(t)>Math.abs(n)?c(e):(window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d))}else e.preventDefault(),t(e.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d)},f=this._callOnFinishChange.bind(this),p;this.$slider.addEventListener(`mousedown`,n),this.$slider.addEventListener(`touchstart`,l,{passive:!1}),this.$slider.addEventListener(`wheel`,e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY)&&this._hasScrollBar)return;e.preventDefault();let t=this._normalizeMouseWheel(e)*this._step;this._snapClampSetValue(this.getValue()+t),this.$input.value=this.getValue(),clearTimeout(p),p=setTimeout(f,400)},{passive:!1})}_setDraggingStyle(e,t=`horizontal`){this.$slider&&this.$slider.classList.toggle(`lil-active`,e),document.body.classList.toggle(`lil-dragging`,e),document.body.classList.toggle(`lil-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),t+-n}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),e-=t,e=Math.round(e/this._step)*this._step,e+=t,e=parseFloat(e.toPrecision(15)),e}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){let e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}},zt=class extends Q{constructor(e,t,n,r){super(e,t,n,`lil-option`),this.$select=document.createElement(`select`),this.$select.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$select.addEventListener(`change`,()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener(`focus`,()=>{this.$display.classList.add(`lil-focus`)}),this.$select.addEventListener(`blur`,()=>{this.$display.classList.remove(`lil-focus`)}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(e=>{let t=document.createElement(`option`);t.textContent=e,this.$select.appendChild(t)}),this.updateDisplay(),this}updateDisplay(){let e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}},Bt=class extends Q{constructor(e,t,n){super(e,t,n,`lil-string`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`spellcheck`,`false`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$input.addEventListener(`input`,()=>{this.setValue(this.$input.value)}),this.$input.addEventListener(`keydown`,e=>{e.code===`Enter`&&this.$input.blur()}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}},Vt=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function Ht(e){let t=document.createElement(`style`);t.innerHTML=e;let n=document.querySelector(`head link[rel=stylesheet], head style`);n?document.head.insertBefore(t,n):document.head.appendChild(t)}var Ut=!1,Wt=class e{constructor({parent:e,autoPlace:t=e===void 0,container:n,width:r,title:i=`Controls`,closeFolders:a=!1,injectStyles:o=!0,touchStyles:s=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement(`div`),this.domElement.classList.add(`lil-gui`),this.$title=document.createElement(`button`),this.$title.classList.add(`lil-title`),this.$title.setAttribute(`aria-expanded`,!0),this.$title.addEventListener(`click`,()=>this.openAnimated(this._closed)),this.$title.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$children=document.createElement(`div`),this.$children.classList.add(`lil-children`),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(i),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add(`lil-root`),s&&this.domElement.classList.add(`lil-allow-touch-styles`),!Ut&&o&&(Ht(Vt),Ut=!0),n?n.appendChild(this.domElement):t&&(this.domElement.classList.add(`lil-auto-place`,`autoPlace`),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty(`--width`,r+`px`),this._closeFolders=a}add(e,t,n,r,i){if(Object(n)===n)return new zt(this,e,t,n);let a=e[t];switch(typeof a){case`number`:return new Rt(this,e,t,n,r,i);case`boolean`:return new jt(this,e,t);case`string`:return new Bt(this,e,t);case`function`:return new Lt(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,a)}addColor(e,t,n=1){return new It(this,e,t,n)}addFolder(t){let n=new e({parent:this,title:t});return this.root._closeFolders&&n.close(),n}load(e,t=!0){return e.controllers&&this.controllers.forEach(t=>{t instanceof Lt||t._name in e.controllers&&t.load(e.controllers[t._name])}),t&&e.folders&&this.folders.forEach(t=>{t._title in e.folders&&t.load(e.folders[t._title])}),this}save(e=!0){let t={controllers:{},folders:{}};return this.controllers.forEach(e=>{if(!(e instanceof Lt)){if(e._name in t.controllers)throw Error(`Cannot save GUI with duplicate property "${e._name}"`);t.controllers[e._name]=e.save()}}),e&&this.folders.forEach(e=>{if(e._title in t.folders)throw Error(`Cannot save GUI with duplicate folder "${e._title}"`);t.folders[e._title]=e.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),this.domElement.classList.toggle(`lil-closed`,this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),requestAnimationFrame(()=>{let t=this.$children.clientHeight;this.$children.style.height=t+`px`,this.domElement.classList.add(`lil-transition`);let n=e=>{e.target===this.$children&&(this.$children.style.height=``,this.domElement.classList.remove(`lil-transition`),this.$children.removeEventListener(`transitionend`,n))};this.$children.addEventListener(`transitionend`,n);let r=e?this.$children.scrollHeight:0;this.domElement.classList.toggle(`lil-closed`,!e),requestAnimationFrame(()=>{this.$children.style.height=r+`px`})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(e=>e.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}};function Gt(e){let t=new Wt({title:`Geometry Painter`}),n=e.settings,r=e.crystal,i=e.fissure,a=e.aurora,o=e.reef,s=()=>e.updateModeSettings(`Crystals`),c=()=>e.updateModeSettings(`Molten fissures`),l=()=>e.updateModeSettings(`Aurora silk`),u=()=>e.updateModeSettings(`Bioluminescent reef`),d=[],f=[],p=[],m=[];t.add(n,`mode`,[`Crystals`,`Molten fissures`,`Aurora silk`,`Bioluminescent reef`]).name(`Painting mode`).onChange(t=>{x(t),e.applyModes()});let h=t.addFolder(`Drawing`);h.add(n,`drawMode`).name(`Paint mode (D)`).listen().onChange(()=>e.applyModes()),h.add({undo:()=>e.undoLast()},`undo`).name(`Undo last stroke`),h.add({clear:()=>e.clearAll()},`clear`).name(`Clear all`);let g=t.addFolder(`Crystals (live)`);g.add(r,`palette`,[`Amethyst`,`Ice`,`Emerald`,`Citrine`,`Rose`,`Prism`]).name(`Palette`).onChange(s),g.add(r,`clusterDensity`,1,16).name(`Clusters / unit`).onChange(s),g.add(r,`crystalSize`,.06,.4).name(`Crystal size`).onChange(s),g.add(r,`shards`,0,16,1).name(`Shards / cluster`).onChange(s),g.add(r,`spread`,.3,2.5).name(`Cluster spread`).onChange(s),g.add(r,`tilt`,0,1).name(`Lean / wildness`).onChange(s),g.add(r,`sizeJitter`,0,1).name(`Size variety`).onChange(s),g.add(r,`clearMix`,0,1).name(`Clear crystal mix`).onChange(s),g.add(r,`glow`,0,2).name(`Inner glow`).onChange(t=>e.setGlow(t)),g.add(r,`growthSpeed`,.2,4).name(`Growth speed`).onChange(s),d.push(g);let _=t.addFolder(`Molten fissures (live)`);_.add(i,`width`,.02,.16).name(`Crack width`).onChange(c),_.add(i,`heat`,.2,3).name(`Heat`).onChange(c),_.add(i,`pulseSpeed`,0,3).name(`Pulse speed`).onChange(c),_.add(i,`branchDensity`,0,8).name(`Branches / unit`).onChange(c),_.add(i,`branchLength`,.05,.6).name(`Branch length`).onChange(c),_.add(i,`emberRate`,0,80).name(`Embers`).onChange(c),_.add(i,`rockDensity`,0,30).name(`Rock lips / unit`).onChange(c),_.add(i,`rockSize`,.03,.2).name(`Rock size`).onChange(c),_.add(i,`lightSpill`,0,3).name(`Light spill`).onChange(c),_.add(i,`growthSpeed`,.5,6).name(`Crack speed`).onChange(c),f.push(_);let v=t.addFolder(`Aurora silk (live)`);v.add(a,`palette`,[`Borealis`,`Twilight`,`Ember`,`Spectrum`]).name(`Palette`).onChange(l),v.add(a,`height`,.15,1.3).name(`Curtain height`).onChange(l),v.add(a,`wave`,0,1).name(`Billow`).onChange(l),v.add(a,`flow`,0,3).name(`Flow speed`).onChange(l),v.add(a,`rays`,0,1).name(`Ray streaks`).onChange(l),v.add(a,`brightness`,.2,2.5).name(`Brightness`).onChange(l),v.add(a,`sparkles`,0,240,1).name(`Star motes`).onChange(l),v.add(a,`lightSpill`,0,3).name(`Light spill`).onChange(l),v.add(a,`growthSpeed`,.3,4).name(`Unfurl speed`).onChange(l),p.push(v);let y=t.addFolder(`Bioluminescent reef (live)`);y.add(o,`palette`,[`Abyss`,`Tropic`,`Ghost`,`Toxic`]).name(`Palette`).onChange(u),y.add(o,`colonySize`,.08,.35).name(`Colony size`).onChange(u),y.add(o,`density`,2,14).name(`Colonies / unit`).onChange(u),y.add(o,`branching`,0,1).name(`Branching`).onChange(u),y.add(o,`tendrils`,0,14,1).name(`Anemone arms`).onChange(u),y.add(o,`glow`,0,2.5).name(`Bioluminescence`).onChange(u),y.add(o,`pulseSpeed`,0,3).name(`Pulse speed`).onChange(u),y.add(o,`sway`,0,1).name(`Current sway`).onChange(u),y.add(o,`plankton`,0,220,1).name(`Plankton`).onChange(u),y.add(o,`lightSpill`,0,3).name(`Light spill`).onChange(u),y.add(o,`growthSpeed`,.3,4).name(`Bloom speed`).onChange(u),m.push(y);let b=t.addFolder(`Light & look (live)`);b.add(n,`exposure`,.4,2.2).name(`Exposure`).onChange(t=>e.setExposure(t)),b.add(n,`envIntensity`,0,2.5).name(`Studio light`).onChange(t=>e.setEnvIntensity(t)),b.add(n,`backlight`,0,2.5).name(`Backlight`).onChange(t=>e.setBacklight(t)),b.add(n,`bloomStrength`,0,1.5).name(`Bloom`).onChange(t=>e.setBloomStrength(t)),b.add(n,`bloomThreshold`,.2,1.5).name(`Bloom threshold`).onChange(t=>e.setBloomThreshold(t)),b.add(n,`seed`,0,999,1).name(`Seed`).onChange(()=>e.scheduleRegrow(`instant`)),t.addFolder(`Growth animation`).add({replay:()=>e.scheduleRegrow(`animate`)},`replay`).name(`▶ Replay growth`);function x(e){for(let t of d)e===`Crystals`?t.show():t.hide();for(let t of f)e===`Molten fissures`?t.show():t.hide();for(let t of p)e===`Aurora silk`?t.show():t.hide();for(let t of m)e===`Bioluminescent reef`?t.show():t.hide()}x(n.mode);let S=e=>{let t=[],n=e;return(n.controllers||[]).forEach(e=>t.push(e)),(n.folders||[]).forEach(e=>t.push(...S(e))),t},C=S(t);return window.__gpApplyLang=(e,n)=>{let r=n.en||{},i=n.ko||{},a=t.domElement.querySelector(`.title`);a&&(a.textContent=e===`ko`?`지오메트리 페인터`:`Geometry Painter`);let o=Object.keys(r).sort((e,t)=>t.length-e.length),s=Object.keys(i).sort((e,t)=>t.length-e.length),c=(e,t)=>{let n=e;return t===`ko`?o.forEach(e=>{n.indexOf(e)!==-1&&(n=n.split(e).join(r[e]))}):s.forEach(e=>{n.indexOf(e)!==-1&&(n=n.split(e).join(i[e]))}),n};C.forEach(t=>{typeof t._name==`string`&&(t._name=c(t._name,e));let n=t.$name;n&&typeof n.set==`function`?n.set(c(t._name,e)):n&&typeof n.updateDisplay==`function`&&n.updateDisplay()})},t}var Kt=-1.55,qt=class{container;settings={mode:`Crystals`,drawMode:!0,seed:1,exposure:1.1,envIntensity:.9,backlight:1,bloomStrength:.4,bloomThreshold:.75};crystal={...we};fissure={...Oe};aurora={...Me};reef={...$e};modes={Crystals:Ee,"Molten fissures":De,"Aurora silk":Qe,"Bioluminescent reef":At};settingsFor(e){switch(e){case`Crystals`:return{...this.crystal};case`Molten fissures`:return{...this.fissure};case`Aurora silk`:return{...this.aurora};case`Bioluminescent reef`:return{...this.reef}}}renderer;post;bloomNode;scene=new ue;camera=new se(45,1,.01,100);controls;painter;floatRoot=new n;sphere;paintRoot=new n;strokes=[];live=[];strokeCounter=0;dust;dustVel=[];backLights=[];hud=document.getElementById(`hud`);lastTime=0;hovering=!1;toastTimer=0;regrowPending=null;lastRegrowAt=0;regrowCost=0;constructor(e){this.container=e}async start(){let e=new f({antialias:!0});await e.init(),e.setPixelRatio(Math.min(devicePixelRatio,2)),e.toneMapping=4,e.toneMappingExposure=this.settings.exposure,e.shadowMap.enabled=!0,e.shadowMap.type=2,this.container.appendChild(e.domElement),this.renderer=e,this.scene.background=new l(658192),this.scene.fog=new be(658192,9,22),this.camera.position.set(2.7,1.15,3.3),this.controls=new pe(this.camera,e.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=1.6,this.controls.maxDistance=10,this.controls.target.set(0,-.05,0),this.controls.maxPolarAngle=Math.PI/2-.02,this.setupEnvironment(),this.setupLights(),this.setupCanvasSphere(),this.setupDust(),this.setupPost(),this.painter=new je(e.domElement,this.camera,this.scene,()=>[this.sphere],this.floatRoot),this.painter.onStroke=e=>this.addStroke(e),this.painter.onActiveChange=e=>{this.controls.enabled=!e},this.painter.onHoverChange=e=>{this.hovering=e,this.updateHud()},Gt(this),this.applyModes(),document.getElementById(`modeBtn`).addEventListener(`click`,()=>this.toggleMode()),window.addEventListener(`keydown`,e=>{e.repeat||e.target instanceof HTMLInputElement||e.key.toLowerCase()===`d`&&this.toggleMode()}),window.addEventListener(`resize`,this.onResize),this.onResize(),e.setAnimationLoop(e=>this.tick(e))}setupEnvironment(){let e=new ue,t=new D(1,1),n=(n,r,i,a,o)=>{let s=new u({side:2});s.color.set(n).multiplyScalar(r);let c=new _(t,s);c.scale.set(i,a,1),c.position.set(...o),c.lookAt(0,0,0),e.add(c)};n(16774890,9,4.5,3,[1.5,8,2]),n(16777215,22,.7,4.5,[-2.5,5,-6]),n(10336511,5,1.2,7,[-7,2,-2]),n(16767408,3.5,1.6,5,[6,1.5,3]),n(9067775,4,6,3.5,[0,2.5,-8]),n(3030104,1.2,9,9,[0,-5,0]);let i=new r(this.renderer);this.scene.environment=i.fromScene(e,.04).texture,this.scene.environmentIntensity=this.settings.envIntensity,i.dispose(),t.dispose()}setupLights(){let t=new m(9347272,789012,.15),n=new ie(16773858,70,0,Math.PI/5,.55,1.8);n.position.set(3.4,5.6,2.6),n.target.position.set(0,0,0),n.castShadow=!0,n.shadow.mapSize.set(2048,2048),n.shadow.camera.near=1,n.shadow.camera.far=20,n.shadow.bias=-4e-4,n.shadow.normalBias=.02,n.shadow.radius=5;let r=new o(11122943,2.4);r.position.set(-3,3.2,-4.5);let i=new o(13281023,1.2);i.position.set(4.5,1.2,-3),this.backLights=[{light:r,base:2.4},{light:i,base:1.2}];let a=new b(6966230,.4,6,1.6);a.position.set(0,-1.3,0);let s=new _(new c(14,64),new e({map:Yt(),color:16777215,roughness:.95,metalness:0,specularIntensity:.15,envMapIntensity:.15}));s.rotation.x=-Math.PI/2,s.position.y=Kt,s.receiveShadow=!0;let l=new _(new E(30,32,16),new u({map:Jt(),side:1,fog:!1}));this.scene.add(t,n,n.target,r,i,a,s,l)}setupCanvasSphere(){let t=new e({color:1776932,metalness:.05,roughness:.52,clearcoat:.35,clearcoatRoughness:.3,sheen:.15,sheenColor:new l(5925808),sheenRoughness:.7,envMapIntensity:.55});this.sphere=new _(new E(1,96,64),t),this.sphere.castShadow=!0,this.sphere.receiveShadow=!0,this.floatRoot.add(this.sphere,this.paintRoot),this.scene.add(this.floatRoot),xe(this.floatRoot)}setupDust(){let e=new Float32Array(960);for(let t=0;t<320;t++){let n=1.9+Math.random()*4.5,r=Math.random()*Math.PI*2;e[t*3]=Math.cos(r)*n,e[t*3+1]=-1.45+Math.random()*4.2,e[t*3+2]=Math.sin(r)*n,this.dustVel.push(.02+Math.random()*.05)}let n=new t;n.setAttribute(`position`,new k(e,3)),this.dust=new ce(n,new fe({color:10335464,size:.02,transparent:!0,opacity:.45,depthWrite:!1,blending:2,sizeAttenuation:!0})),this.dust.frustumCulled=!1,this.scene.add(this.dust)}setupPost(){let e=me(this.scene,this.camera,{samples:4}).getTextureNode();this.bloomNode=oe(e,this.settings.bloomStrength,.6,this.settings.bloomThreshold);let t=M(1).sub(j(.5,.92,le.distance(ye(.5,.5))).mul(.35));this.post=new _e(this.renderer),this.post.outputNode=e.add(this.bloomNode).mul(t)}addStroke(e){let t={samples:e,index:this.strokeCounter++,mode:this.settings.mode};this.strokes.push(t),this.buildStroke(t,!0),this.showToast({Crystals:`💎 crystals seeded — watch them grow`,"Molten fissures":`🔥 fissure torn open — stand back`,"Aurora silk":`🌌 aurora silk unfurling — look up`,"Bioluminescent reef":`🪸 reef colony seeded — watch it come alive`}[t.mode])}buildStroke(e,t){let n=this.effectiveSeed(e.index),r=this.modes[e.mode].createStroke(e.samples,n,this.settingsFor(e.mode));this.paintRoot.add(r.group),this.live.push(r),t||r.finishGrowth()}regrow(e){for(let e of this.live)e.dispose();this.live=[];for(let t of this.strokes)this.buildStroke(t,e)}scheduleRegrow(e){this.regrowPending?.mode!==`animate`&&(this.regrowPending={mode:e})}undoLast(){this.strokes.pop(),this.live.pop()?.dispose()}clearAll(){for(let e of this.live)e.dispose();this.live=[],this.strokes=[],this.regrowPending=null}effectiveSeed(e){return(this.settings.seed*2654435761^e*40503+1)>>>0}updateModeSettings(e){let t=!1;for(let n=0;n<this.live.length;n++){if(this.strokes[n].mode!==e)continue;let r=this.live[n];r.applySettings?r.applySettings(this.settingsFor(e)):t=!0}t&&this.scheduleRegrow(`instant`)}setGlow(e){this.crystal.glow=e,Te(e)}setExposure(e){this.settings.exposure=e,this.renderer.toneMappingExposure=e}setEnvIntensity(e){this.settings.envIntensity=e,this.scene.environmentIntensity=e}setBacklight(e){this.settings.backlight=e;for(let{light:t,base:n}of this.backLights)t.intensity=n*e}setBloomStrength(e){this.settings.bloomStrength=e,this.bloomNode.strength.value=e}setBloomThreshold(e){this.settings.bloomThreshold=e,this.bloomNode.threshold.value=e}toggleMode(){this.settings.drawMode=!this.settings.drawMode,this.applyModes()}applyModes(){let e=this.settings.drawMode;this.painter.setEnabled(e),this.controls.enableRotate=!e,document.body.classList.toggle(`draw`,e),document.body.classList.toggle(`orbit`,!e);let t=document.getElementById(`modeBtn`);t.querySelector(`.label`).textContent=e?`Paint mode`:`Orbit mode`,e||(this.hovering=!1),this.updateHud()}updateHud(){let e=this.renderer.backend.isWebGPUBackend?`WebGPU`:`WebGL2 (fallback)`,t={Crystals:`crystal vein`,"Molten fissures":`molten fissure`,"Aurora silk":`silk of aurora`,"Bioluminescent reef":`reef colony`}[this.settings.mode],n;n=this.settings.drawMode?this.hovering?`<b>Drag now</b> to paint a ${t} across the sphere — it grows when you let go.`:`Move over the sphere, then <b>drag</b> to paint a ${t}. Press <b>D</b> to orbit.`:`<b>Orbit mode</b> — drag to rotate, scroll to zoom, right-drag to pan. Press <b>D</b> to paint.`,this.hud.innerHTML=`${n}<div class="sub">Mode: ${this.settings.mode} · Renderer: ${e}</div>`}showToast(e){let t=document.getElementById(`toast`);t.textContent=e,t.classList.add(`show`),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>t.classList.remove(`show`),1800)}onResize=()=>{let e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)};tick(e){let t=Math.min((e-this.lastTime)/1e3,.05);this.lastTime=e;let n=e/1e3;if(this.regrowPending){let e=performance.now(),t=this.regrowPending.mode===`animate`?0:g.clamp(this.regrowCost*3,60,400);if(e-this.lastRegrowAt>=t){let e=this.regrowPending;this.regrowPending=null;let t=performance.now();this.regrow(e.mode===`animate`),this.regrowCost=performance.now()-t,this.lastRegrowAt=performance.now()}}let r=this.dust.geometry.getAttribute(`position`),i=r.array;for(let e=0;e<this.dustVel.length;e++)i[e*3+1]+=this.dustVel[e]*t,i[e*3+1]>2.8500000000000005&&(i[e*3+1]=-1.45);r.needsUpdate=!0,this.controls.update(),this.painter.update(t);for(let e of this.live)e.update(t,n);this.post.render()}};function Jt(){let e=1024,t=document.createElement(`canvas`);t.width=e,t.height=512;let n=t.getContext(`2d`);n.fillStyle=`#06070b`,n.fillRect(0,0,e,512);let r=(e,t,r,i)=>{let a=n.createRadialGradient(e,t,0,e,t,r);a.addColorStop(0,i),a.addColorStop(1,`rgba(0,0,0,0)`),n.fillStyle=a,n.fillRect(e-r,t-r,r*2,r*2)};r(e*.3,194.56,280,`rgba(74, 52, 138, 0.34)`),r(e*.78,230.4,220,`rgba(40, 58, 118, 0.22)`),r(e*.55,102.4,180,`rgba(120, 100, 190, 0.10)`);let i=new O(t);return i.colorSpace=ne,i}function Yt(){let e=document.createElement(`canvas`);e.width=e.height=512;let t=e.getContext(`2d`),n=t.createRadialGradient(256,256,0,256,256,256);n.addColorStop(0,`#0f1118`),n.addColorStop(.45,`#0b0c12`),n.addColorStop(1,`#08090d`),t.fillStyle=n,t.fillRect(0,0,512,512);let r=new O(e);return r.colorSpace=ne,r}var Xt=new qt(document.getElementById(`app`));window.__app=Xt,Xt.start().catch(e=>{console.error(e);let t=document.createElement(`div`);t.className=`fatal`,t.textContent=`Failed to start the renderer: ${e.message}. This app needs WebGPU or WebGL2 — try a recent Chrome, Edge or Firefox.`,document.body.appendChild(t)});