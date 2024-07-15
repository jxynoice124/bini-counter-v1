$(document).ready(function() {
  const key = process.env.youtubeAPIKey;
  const videoIDs = [
    'Zx31bB2vMns', // Cherry On Top
    'wufUX5P2Ds8', // Salamin
    'J1Ip2sC_lss', // Pantropiko
    'QNV2DmBxChQ', // Karera
    'wJ6GCeSR4ss' // Nanana
  ];

  // Elements
  var viewCountEl = document.querySelector('.live_view_count'); // Cherry On Top
  var subCountEl = document.querySelector('.live_sub_count'); // Salamin
  var thirdCountEl = document.querySelector('.live_third_count'); // Pantropiko
  var kareraCountEl = document.querySelector('.live_karera_count'); // Karera
  var nananaCountEl = document.querySelector('.live_nanana_count'); // Nanana

  if (!viewCountEl || !subCountEl || !thirdCountEl || !kareraCountEl || !nananaCountEl) {
    console.error('Some elements not found');
    return;
  }

  var viewCount = new Odometer({ el: viewCountEl, format: ',ddd', theme: 'default' });
  var subCount = new Odometer({ el: subCountEl, format: ',ddd', theme: 'default' });
  var thirdCount = new Odometer({ el: thirdCountEl, format: ',ddd', theme: 'default' });
  var kareraCount = new Odometer({ el: kareraCountEl, format: ',ddd', theme: 'default' });
  var nananaCount = new Odometer({ el: nananaCountEl, format: ',ddd', theme: 'default' });

  // Fetch video data for each video ID
  videoIDs.forEach((videoID, index) => {
    const odometer = [viewCount, subCount, thirdCount, kareraCount, nananaCount][index];
  setInterval(function () {
    getYoutubeVideoData(videoID, odometer);
  }, 4000);    
  });

  function getYoutubeVideoData(videoID, odometer) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoID}&key=${key}`;

    $.getJSON(apiUrl)
      .done(function(result) {
        console.log('Video API Response:', result);

        if (result && result.items && result.items.length > 0) {
          const videoData = result.items[0];
          const viewCount = videoData.statistics.viewCount;
          const title = videoData.snippet.title;

          // Update the odometer and title
          odometer.update(viewCount);

          let containerId;
          if (odometer.el === viewCountEl) {
            containerId = 'view-container';
          } else if (odometer.el === subCountEl) {
            containerId = 'sub-container';
          } else if (odometer.el === thirdCountEl) {
            containerId = 'third-container';
          } else if (odometer.el === kareraCountEl) {
            containerId = 'fourth-container';
          } else if (odometer.el === nananaCountEl) {
            containerId = 'fifth-container';
          }

          if (containerId) {
            document.querySelector(`#${containerId} .counter-label`).textContent = title;
          } else {
            console.error('Container ID mapping not found for odometer:', odometer.el.className);
          }
        } else {
          console.error('No data found or unexpected response structure.');
          odometer.update('Error');
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching video data:', textStatus, errorThrown);
        odometer.update('Error');
      });
  }

  window.captureCounter = function(button) {
    const container = button.closest('.counter-container');

    if (!container) {
      console.error('Container not found');
      return;
    }

    const screenshotButton = container.querySelector('.screenshot-button');
    const shareButton = container.querySelector('.share-button');
    if (screenshotButton) {
      screenshotButton.style.display = 'none';
    }
    if (shareButton) {
      shareButton.style.display = 'none';
    }

    container.style.borderRadius = '0';
    container.style.overflow = 'visible';

    html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      scrollX: 0,
      scrollY: -window.scrollY,
      logging: true
    }).then(canvas => {
      console.log('Screenshot captured for container.');

      container.style.borderRadius = '';
      container.style.overflow = '';

      if (screenshotButton) {
        screenshotButton.style.display = 'inline-block';
      }
      if (shareButton) {
        shareButton.style.display = 'inline-block';
      }

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `screenshot_${container.id}.png`;
      link.click();
    }).catch(error => {
      console.error('Error capturing screenshot:', error);
    });
  };
  document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', function() {
      const shareUrl = button.getAttribute('data-share-url');
      if (navigator.share) {
        navigator.share({
          title: 'BINI Music Videos Counter',
          url: shareUrl
        }).catch(console.error);
      } else {
        // Fallback for browsers that do not support the Web Share API
        alert(`Please share this URL: ${shareUrl}`);
      }
    });
  });
});
