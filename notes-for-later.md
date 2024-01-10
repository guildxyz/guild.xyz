## Drive API setup

I can't quite remember all the steps, but the error messages from the Drive API were very detaild on what to configure. As I remember I just had to enable the Drive API on GCP

## `next.config.js`

Enabled the usage of SWC for minification instead of the default Terser, because building the app failed with Terser. I believe newer versions of Next.js default to SWC, so this option might not be needed once we update
