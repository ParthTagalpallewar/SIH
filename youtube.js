const axios = require('axios');
const ytdl = require('ytdl-core');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
// Set up YouTube Data API with your API key
const apiKey = '';


async function getChannelIdByName(apiKey) {
    try {
      const channelName= "TimesNow";
      const url = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&forUsername=${channelName}&part=id`;
  
      const response = await axios.get(url);
      const channel = response.data.items[0];
  
      if (channel) {
        return channel.id;
      } else {
        console.log(`Channel not found for ${channelName}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching channel ID by name:', error);
      return null;
    }
  }
  

  async function downloadHighestQualityAudio(videoId) {
    try {
      // Create a directory (folder) to store downloaded files
      const downloadsDir = path.join(__dirname, 'downloads'); // 'downloads' will be the folder name
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
      }
  
      // Fetch video info to get available audio streams
      const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
      
      // Find the highest-quality audio stream
      const audioStreams = ytdl.filterFormats(info.formats, 'audioonly');
      const highestAudio = audioStreams.reduce((prev, current) => {
        return (prev.audioBitrate > current.audioBitrate) ? prev : current;
      });
  
      if (!highestAudio) {
        console.error('No audio stream found for the video.');
        return null;
      }
  
      // Download the highest-quality audio stream
      const audioFileName = `${videoId}.mp3`; // You can choose the desired file format
      const audioFilePath = path.join(downloadsDir, audioFileName); // Specify the download path within the folder
      const audioStream = ytdl.downloadFromInfo(info, { filter: format => format.url === highestAudio.url });
  
      audioStream.pipe(fs.createWriteStream(audioFilePath));
  
      return audioFilePath;
    } catch (error) {
      console.error('Error downloading audio:', error);
      return null;
    }
  }
// Function to check for new videos
async function checkForNewVideos() {
    // Get the Channel ID by channel name
    const channelId = "UCdOSeEq9Cs2Pco7OCn2_i5w";

    if (channelId) {
      // Use the YouTube Data API to search for new videos by channel ID
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&order=date&part=snippet&type=video`;

      try {
        const response = await axios.get(searchUrl);
        const video = response.data.items[0]; // Assuming the first result is the latest video

        if (video) {
          const videoId = video.id.videoId;
          const videoTitle = video.snippet.title;
          const videoDescription = video.snippet.description;
          // Check if you've already processed this video (e.g., by checking a database)

          // Download the video using ytdl-core (not including audio)
          const videoFilePath = await downloadHighestQualityAudio(videoId);

          if (videoFilePath) {
            // Store video metadata and file path in a database or file
            // ...
            console.log(video);
            console.log(`New video found: ${videoTitle}\n${videoDescription}`);
          }
        }
      } catch (error) {
        console.error('Error checking for new videos:', error);
      }
  }
}

// Main function to start the monitoring
async function main() {
  try {
    console.log("Hello");
    // Schedule the script to run periodically
    // Example using node-cron to run every hour
    checkForNewVideos(); // Runs every hour
  } catch (error) {
    console.error('Error starting the monitoring:', error);
  }
}

// Run the main function to start monitoring
main();

/*
json response

{
  kind: 'youtube#searchResult',
  etag: 'i1nF3Op4l2brqWJam4oXs4oM6rk',
  id: { kind: 'youtube#video', videoId: '1v1E_QStUfo' },
  snippet: {
    publishedAt: '2023-09-19T14:51:51Z',
    channelId: 'UCdOSeEq9Cs2Pco7OCn2_i5w',
    title: 'Vandana Chavan | राजकीयदृष्ट्या आम्ही वेगळे हे पवारांनी दाखवून दिलं : वंदना चव्हाण',
    description: 'tv9 marathi live upade पाहण्यासाठी लॉग इन करा https://www.tv9marathi.com/ टीव्ही ९ मराठीवर ...',
    thumbnails: { default: [Object], medium: [Object], high: [Object] },
    channelTitle: 'TV9 Marathi',
    liveBroadcastContent: 'none',
    publishTime: '2023-09-19T14:51:51Z'
  }
}
*/