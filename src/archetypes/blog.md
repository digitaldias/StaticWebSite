---
title: "{{ replaceRE `^\d{4}-\d{2}-\d{2}-` "" .File.ContentBaseName | humanize }}"
date: {{ .Date | time.Format "2006-01-02" }}
draft: true
description: ""
excerpt: ""
tldr: ""
categories: []
tags: []
author: "Pedro Dias"
featuredImage: "/images/blog/{{ .File.ContentBaseName }}/featured.jpg"
featuredAlt: ""
imageCredit: "© Pedro Dias"
---
