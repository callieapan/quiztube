const YoutubeTranscript = require('youtube-transcript');

async function mainFn() {
  const transcribeObjArr =
    await YoutubeTranscript.YoutubeTranscript.fetchTranscript(
      'youtube.com/watch?v=tZVZQLyCDfo',
      {
        lang: 'en-US',
      },
    );

  let info = '';

  transcribeObjArr.forEach((transactionObj) => {
    info += transactionObj.text;
  });

  console.log(info);
}

mainFn();
