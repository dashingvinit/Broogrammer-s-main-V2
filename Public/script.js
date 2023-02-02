
 (new IntersectionObserver(function(e,o){
  if (e[0].intersectionRatio > 0){
      document.documentElement.removeAttribute('sticky-top');
  } else {
      document.documentElement.setAttribute('sticky-top','stuck');
  };
})).observe(document.querySelector('#nav-anker'));