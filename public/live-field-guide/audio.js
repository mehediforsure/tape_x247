// All teaching sounds are synthesized here; no samples or external audio are loaded.
export class TeachingAudio {
  constructor(){this.context=null;this.master=null;this.sources=new Set();this.muted=true;}
  async enable(){
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)throw new Error('This browser does not support Web Audio. The visual experiments still work.');
    if(!this.context){
      this.context=new Context();this.master=this.context.createGain();this.master.gain.value=.22;
      const limiter=this.context.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=4;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.12;
      this.master.connect(limiter);limiter.connect(this.context.destination);
    }
    await this.context.resume();this.setMuted(false);
  }
  setMuted(value){this.muted=value;if(this.context)this.master.gain.setTargetAtTime(value?0:.22,this.context.currentTime,.015);}
  track(node,when=0){node.teachingStart=when;this.sources.add(node);node.onended=()=>{this.sources.delete(node);node.disconnect();};return node;}
  cancelAfter(when){for(const node of this.sources){if(node.teachingStart>=when-.001){try{node.stop();}catch{}this.sources.delete(node);}}}
  stopAll(){for(const node of this.sources){try{node.stop();}catch{}}this.sources.clear();}
  tone(freq,when,duration=.18,level=.4,type='triangle',cutoff=10000){
    if(!this.context)return;const c=this.context;const t=Math.max(c.currentTime,when);const osc=this.track(c.createOscillator(),t);const gain=c.createGain();const filter=c.createBiquadFilter();
    osc.type=type;osc.frequency.value=freq;filter.type='lowpass';filter.frequency.value=cutoff;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
    osc.connect(filter);filter.connect(gain);gain.connect(this.master);osc.start(t);osc.stop(t+duration+.03);osc.addEventListener('ended',()=>{gain.disconnect();filter.disconnect();});
  }
  drum(kind,when,rate=1,level=.6){
    if(!this.context)return;const c=this.context;const t=Math.max(c.currentTime,when);
    if(kind==='kick'){
      const osc=this.track(c.createOscillator(),t),g=c.createGain();osc.frequency.setValueAtTime(145*rate,t);osc.frequency.exponentialRampToValueAtTime(44*rate,t+.12);g.gain.setValueAtTime(level,t);g.gain.exponentialRampToValueAtTime(.0001,t+.24);osc.connect(g);g.connect(this.master);osc.start(t);osc.stop(t+.26);osc.addEventListener('ended',()=>g.disconnect());return;
    }
    const dur=kind==='hat'?.06:.16,buffer=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
    const src=this.track(c.createBufferSource(),t),g=c.createGain(),f=c.createBiquadFilter();src.buffer=buffer;src.playbackRate.value=rate;f.type='highpass';f.frequency.value=kind==='hat'?6500:1500;g.gain.setValueAtTime(level*(kind==='hat'?.24:.5),t);g.gain.exponentialRampToValueAtTime(.0001,t+dur/rate);src.connect(f);f.connect(g);g.connect(this.master);src.start(t);src.addEventListener('ended',()=>{g.disconnect();f.disconnect();});
    if(kind==='snare')this.tone(180*rate,t,.09,level*.3,'triangle');
  }
  envelope(params){
    if(!this.context)return null;const c=this.context,t=c.currentTime,osc=this.track(c.createOscillator()),g=c.createGain(),filter=c.createBiquadFilter();
    osc.type='sawtooth';osc.frequency.value=130.8128;filter.type='lowpass';filter.frequency.value=1400;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+params.a);g.gain.linearRampToValueAtTime(.35*params.s,t+params.a+params.d);osc.connect(filter);filter.connect(g);g.connect(this.master);osc.start(t);
    let released=false;osc.addEventListener('ended',()=>{g.disconnect();filter.disconnect();});
    return {release:(level,seconds)=>{if(released)return;released=true;const now=c.currentTime;g.gain.cancelScheduledValues(now);g.gain.setValueAtTime(.35*level,now);g.gain.linearRampToValueAtTime(0,now+seconds);osc.stop(now+seconds+.02);}};
  }
}
