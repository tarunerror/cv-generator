import axios from "axios"
import cheerio from "cheerio"

export async function scrapeWithSerpApi(url, serpApiKey) {
  if (!serpApiKey) return null
  try {
    const params = new URLSearchParams({
      q: url,
      engine: "google",
      api_key: serpApiKey
    })
    const res = await axios.get(`https://serpapi.com/search.json?${params.toString()}`)
    // try to collect organic results snippets
    const data = res.data || {}
    if (data.organic_results && data.organic_results.length) {
      const text = data.organic_results.map((r)=> r.snippet || r.title || "").join("\n\n")
      return text
    }
    return null
  } catch (err) {
    console.warn("SerpAPI failed", err.message)
    return null
  }
}

export async function scrapeFallback(url) {
  try {
    const res = await axios.get(url, { timeout: 10000 })
    const $ = cheerio.load(res.data)
    // remove scripts, styles, nav, footer, ads
    $("script,style,nav,footer,header,aside,form,svg").remove()
    const text = $("body").text().replace(/\s+/g, " ").trim()
    return text
  } catch (err) {
    console.warn("Fallback scrape failed", err.message)
    return ""
  }
}
