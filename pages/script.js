$(document).ready(function() {
  const key = 'AIzaSyC9X8DEYN_Csp8OU1aIzv_Kn3yYJBJGzkA';
  const videoIDs = [
    'Zx31bB2vMns',
    'wufUX5P2Ds8',
    'J1Ip2sC_lss',
    'QNV2DmBxChQ',
    'wJ6GCeSR4ss'
  ];

  var viewCountEl = document.querySelector('.live_view_count');
  var subCountEl = document.querySelector('.live_sub_count');
  var thirdCountEl = document.querySelector('.live_third_count');
  var kareraCountEl = document.querySelector('.live_karera_count');
  var nananaCountEl = document.querySelector('.live_nanana_count');

  if (!viewCountEl || !subCountEl || !thirdCountEl || !kareraCountEl || !nananaCountEl) {
    console.error('Some elements not found');
    return;
  }

  var viewCount = new Odometer({ el: viewCountEl, format: ',ddd', theme: 'default' });
  var subCount = new Odometer({ el: subCountEl, format: ',ddd', theme: 'default' });
  var thirdCount = new Odometer({ el: thirdCountEl, format: ',ddd', theme: 'default' });
  var kareraCount = new Odometer({ el: kareraCountEl, format: ',ddd', theme: 'default' });
  var nananaCount = new Odometer({ el: nananaCountEl, format: ',ddd', theme: 'default' });

  videoIDs.forEach((videoID, index) => {
    const odometer = [viewCount, subCount, thirdCount, kareraCount, nananaCount][index];
    getYoutubeVideoData(videoID, odometer);
    setInterval(function () {
      getYoutubeVideoData(videoID, odometer);
    }, 4000);    
  });

  function getYoutubeVideoData(videoID, odometer) {
    const apiUrl = `/api/youtube?videoID=${videoID}`;

    $.getJSON(apiUrl)
      .done(function(result) {
        if (result && result.items && result.items.length > 0) {
          const videoData = result.items[0];
          const viewCount = videoData.statistics.viewCount;
          const title = videoData.snippet.title;

          if (!isNaN(viewCount)) {
            odometer.update(Number(viewCount));
          } else {
            odometer.update('Error');
          }

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
          odometer.update('Error');
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        odometer.update('Error');
      });
  }

  window.captureCounter = function(button) {
    const container = button.closest('.counter-container');

    if (!container) {
      console.error('Container not found');
      return;
    }

    const watermarkText = document.createElement('div');
    watermarkText.textContent = 'https://binicounter.netlify.app';
    watermarkText.style.position = 'absolute';
    watermarkText.style.bottom = '40px';
    watermarkText.style.left = '50%';
    watermarkText.style.transform = 'translateX(-50%)';
    watermarkText.style.fontSize = '9px';
    watermarkText.style.color = 'rgba(255, 255, 255, 0.5)';
    watermarkText.classList.add('watermark');

    const copyrightText = document.createElement('div');
    copyrightText.textContent = '© 2024 ABS-CBN. All rights reserved.';
    copyrightText.style.position = 'absolute';
    copyrightText.style.bottom = '20px';
    copyrightText.style.left = '50%';
    copyrightText.style.transform = 'translateX(-50%)';
    copyrightText.style.fontSize = '9px';
    copyrightText.style.color = 'rgba(255, 255, 255, 0.5)';
    copyrightText.classList.add('copyright');

    container.appendChild(watermarkText);
    container.appendChild(copyrightText);

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
      container.style.borderRadius = '';
      container.style.overflow = '';

      if (screenshotButton) {
        screenshotButton.style.display = 'inline-block';
      }
      if (shareButton) {
        shareButton.style.display = 'inline-block';
      }

      container.removeChild(watermarkText);
      container.removeChild(copyrightText);

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
        alert(`Please share this URL: ${shareUrl}`);
      }
    });
  });
});
