{{- $body := .RawContent -}}
{{- range findRE `\{\{<\s*img\s[^\n]*?>\}\}` .RawContent -}}
  {{- $m := . -}}
  {{- $src := "" -}}{{- $alt := "" -}}{{- $cap := "" -}}{{- $credit := "" -}}
  {{- with findRESubmatch `\ssrc="([^"]*)"` $m 1 -}}{{- $src = index (index . 0) 1 -}}{{- end -}}
  {{- with findRESubmatch `\salt="([^"]*)"` $m 1 -}}{{- $alt = index (index . 0) 1 -}}{{- end -}}
  {{- with findRESubmatch `\scaption="([^"]*)"` $m 1 -}}{{- $cap = index (index . 0) 1 -}}{{- end -}}
  {{- with findRESubmatch `\scredit="([^"]*)"` $m 1 -}}{{- $credit = index (index . 0) 1 -}}{{- end -}}
  {{- $src = cond (hasPrefix $src "/") (printf "%s%s" (strings.TrimSuffix "/" site.Home.Permalink | replaceRE `^(https?://[^/]+).*$` "$1") $src) $src -}}
  {{- $md := printf "![%s](%s)" $alt $src -}}
  {{- with $cap }}{{ $md = printf "%s\n*%s*" $md . }}{{ end -}}
  {{- with $credit }}{{ $md = printf "%s\n*%s*" $md . }}{{ end -}}
  {{- $body = replace $body $m $md -}}
{{- end -}}
{{- range findRE `(?s)\{\{<\s*callout[^\n]*?>\}\}.*?\{\{<\s*/callout\s*>\}\}` .RawContent -}}
  {{- $m := . -}}
  {{- $title := "" -}}
  {{- with findRESubmatch `\stitle="([^"]*)"` $m 1 -}}{{- $title = index (index . 0) 1 -}}{{- end -}}
  {{- $inner := $m | replaceRE `(?s)^\{\{<\s*callout[^\n]*?>\}\}` "" | replaceRE `(?s)\{\{<\s*/callout\s*>\}\}$` "" | strings.TrimSpace -}}
  {{- if $title }}{{ $inner = printf "**%s**\n\n%s" $title $inner }}{{ end -}}
  {{- $body = replace $body $m (replaceRE `(?m)^` "> " $inner | replaceRE `(?m)^> $` ">") -}}
{{- end -}}
{{- range findRE `(?s)\{\{<\s*pullquote\s*>\}\}.*?\{\{<\s*/pullquote\s*>\}\}` .RawContent -}}
  {{- $m := . -}}
  {{- $inner := $m | replaceRE `(?s)^\{\{<\s*pullquote\s*>\}\}` "" | replaceRE `(?s)\{\{<\s*/pullquote\s*>\}\}$` "" | strings.TrimSpace -}}
  {{- $body = replace $body $m (replaceRE `(?m)^` "> " $inner | replaceRE `(?m)^> $` ">") -}}
{{- end -}}
# {{ .Title }}

Published: {{ .Date.Format "2006-01-02" }}{{ if gt (.Lastmod.Sub .Date).Hours 168.0 }} (updated {{ .Lastmod.Format "2006-01-02" }}){{ end }}
Author: {{ .Params.author | default site.Params.author }}
Canonical: {{ .Permalink }}
{{ with .Params.tldr }}
{{ . }}
{{ end }}
{{ $body | strings.TrimSpace }}
