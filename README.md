# Dempach Archiver

The archiver script for [dempach-archive](https://dempach-archive.uchuu.io) ([Github](https://github.com/uchuuio/dempach-archive)).

### How

Every monday night at 22:00, the lambda function will startup. This will go to the website where tunein gets its stream from (http://aod.tokyofmworld.leanstream.co/storage/tunein_ondemand/) and gets this week's file which is something like `dempa_20180212.mp3` and then uploads this to S3.
