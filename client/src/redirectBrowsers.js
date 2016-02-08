function detectBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent.match(/iPad/i)
    || userAgent.match(/iPhone/i)
    || userAgent.match(/iPod/i)
  ) {
    return 'iOS';
  } else if (userAgent.match(/Android/i)) {
    return 'Android';
  } else if (userAgent.indexOf('MSIE') > -1
    || userAgent.indexOf('Trident') > -1
    || navigator.appVersion.indexOf('Trident') > 0
  ) {
    return 'IE';
  }
  return 'Other';
}

export default function redirectBrowsers() {
  if (detectBrowser() !== 'Other') {
    window.alert('Beta version targets Chrome, Firefox, or Safari 9 OSX.' +
    ' iOS/Android in planning stage.'
    );
    window.location = 'https://www.google.com/chrome/';
  }
}
