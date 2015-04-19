---
layout:     post
title:      "API Project: Vimeo Roulette"
subtitle:   "A bit of fun with Vimeo's oEmbed API."
date:       2015-04-18 17:45:00
author:     "Melanie VanderLugt"
header-img: "img/flower-explosion.jpeg"
<!-- tag:        api-project -->
tag:        projects
---

##Vimeo Roulette

I started futzing around with Vimeo's oEmbed API a month ago, then realized I was lacking a solid JavaScript foundation. Googling things can only get you so far; sometimes you need an academic course start to finish. So down the rabbit hole I went!

I lucked out and found a fantastic JavaScript course on [Learnable](https://learnable.com/home). (Thanks, New Relic, for the free Learnable trial for using your services!)

Vimeo's [oEmbed API](https://developer.vimeo.com/apis/oembed) is absurdly easy to use. No API Keys are required because you're just embedding a video on your own site. Once I figure out how to use their oEmbed API, all I had to do was use JavaScript to find a random Vimeo Video ID, make sure the video exists, and load it from Vimeo.

To see the project, hop on over to my <a href="{{ site.base_url }}/api/vimeo_roulette" class="standout">Vimeo Roulette</a> page.

There are a few things I'm hoping to add soon:

* A button to "Spin Again", so to speak, and fetch a new random video.
* Error checking for times when Vimeo is down.
