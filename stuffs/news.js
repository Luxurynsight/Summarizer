const urls = ["https://www.lesechos.fr/industrie-services/mode-luxe/en-pleine-pandemie-chanel-affiche-un-niveau-record-dinvestissements-1323720","http://www.koreatimes.co.kr/www/tech/2021/10/129_316906.html","https://www.retaildive.com/news/livestreaming-popularity-expected-to-grow-in-2021-coresight-research/599121/","https://www.bangkokpost.com/business/2090383/central-earmarks-b1bn-to-renovate","https://cpp-luxury.com/hermes-opens-new-store-in-daegu-at-shinsegae-department-store-south-korea/","https://www.moodiedavittreport.com/watches-and-wonders-exhibition-opens-at-cdfgs-sanya-international-duty-free-shopping-complex/","https://cpp-luxury.com/russias-luxury-market-gradually-moves-towards-e-ecommerce/","https://jingdaily.com/louis-vuitton-wechat-crm/","https://cpp-luxury.com/bvlgari-hosts-serpentiform-exhibition-at-chengdu-museum/","https://www.wealthx.com/report/high-net-worth-handbook-2019/#downloadform","https://www.moodiedavittreport.com/singapore-changi-airport-begins-luxury-leasing-drive-in-terminal-3/","https://jingdaily.com/pop-up-stores-in-china/","https://wwd.com/fashion-news/fashion-features/burberry-banks-on-riccardo-tisci-brand-buzz-1202606040/","https://www.mediapost.com/publications/article/314814/millennials-are-obsessed-with-pets.html?edition=107651","https://www.forbes.com/sites/muhammadcohen/2017/09/22/china-travelers-moving-from-middle-cabin-to-middle-seat/?sh=7f90024fc94a","https://www.insidermedia.com/news/south-west/mulberry-to-launch-asian-venture","https://cpp-luxury.com/saks-fifth-avenue-to-launch-in-india/","https://www.pambianconews.com/2017/01/20/safilo-crolla-borsa-sospeso-titolo-207328/","https://www.afr.com/world/asia/visitor-numbers-surging-but-offering-has-to-be-right-20161129-gszv8t","http://europe.chinadaily.com.cn/business/2016-09/08/content_26733146.htm"];
const news = [];

let i = 0;
for (let url of urls) {
	i++;
	console.log(`${i} / ${urls.length}) ${url}`);

	const form = new FormData();
	form.append('url', url);

	try {
		const res = await fetch('https://graby.luxurynsight.com/', {
			method: 'POST',
			body: form
		});

		const jsonNews = await res.json();
		news.push(jsonNews);
	} catch() {}
}

Deno.writeTextFile('news.json', JSON.stringify(news));
