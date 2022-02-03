(function(h,o,u,n,d) {
  h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
  d=o.createElement(u);d.async=1;d.src=n
  n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
})(window,document,'script','/datadog-rum-v4.js','DD_RUM')
DD_RUM.onReady(function() {
  DD_RUM.init({
    clientToken: 'pub7cf22f3b79a010363cf58c859cfa8ad8',
    applicationId: '996b7a2a-d610-4235-a5b4-65391973ea76',
    site: 'datadoghq.eu',
    service:'guild.xyz',
    env:'prod',
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
    beforeSend: (event) => {
      if (event.view.url.includes('linkpreview')) return false
    }
  });
  
  DD_RUM.startSessionReplayRecording();
})