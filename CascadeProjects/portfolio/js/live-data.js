// Live Data Dashboard JavaScript
class LiveDataDashboard {
    constructor() {
        this.autoRefreshInterval = null;
        this.autoRefreshEnabled = false;
        this.charts = {};
        this.favorites = new Set(['BTC', 'ETH']);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAllData();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.loadAllData();
        });

        // Auto refresh toggle
        document.getElementById('auto-refresh-btn').addEventListener('click', () => {
            this.toggleAutoRefresh();
        });

        // Weather location change
        document.getElementById('weather-location').addEventListener('change', () => {
            this.loadWeatherData();
        });

        // Crypto filter change
        document.getElementById('crypto-filter').addEventListener('change', () => {
            this.filterCryptoData();
        });

        // Market selector change
        document.getElementById('market-selector').addEventListener('change', () => {
            this.loadStockData();
        });

        // Time range change
        document.getElementById('time-range').addEventListener('change', () => {
            this.updateCharts();
        });

        // News source change
        document.getElementById('news-source').addEventListener('change', () => {
            this.loadNewsData();
        });

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('error-modal').classList.remove('active');
        });

        // Retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            document.getElementById('error-modal').classList.remove('active');
            this.loadWeatherData();
        });
    }

    async loadAllData() {
        this.showLoading();
        try {
            await Promise.all([
                this.loadWeatherData(),
                this.loadCryptoData(),
                this.loadStockData(),
                this.loadNewsData()
            ]);
            this.updateCharts();
            this.hideLoading();
        } catch (error) {
            this.showError('Failed to load data. Please try again.');
            this.hideLoading();
        }
    }

    async loadWeatherData() {
        try {
            // Simulate API call with mock data
            const weatherData = this.generateMockWeatherData();
            this.renderWeatherData(weatherData);
        } catch (error) {
            console.error('Error loading weather data:', error);
        }
    }

    generateMockWeatherData() {
        const locations = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'];
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'];
        const selectedLocation = document.getElementById('weather-location').value;
        
        return locations.map(location => ({
            location: location,
            temp: Math.floor(Math.random() * 30) + 10,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            pressure: Math.floor(Math.random() * 50) + 980,
            visibility: Math.floor(Math.random() * 10) + 5,
            uvIndex: Math.floor(Math.random() * 11) + 1
        }));
    }

    renderWeatherData(data) {
        const weatherGrid = document.getElementById('weather-grid');
        weatherGrid.innerHTML = data.map(weather => `
            <div class="weather-card">
                <div class="weather-location">${weather.location}</div>
                <div class="weather-temp">${weather.temp}°C</div>
                <div class="weather-description">${weather.condition}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <i class="fas fa-tint"></i>
                        <span>${weather.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-wind"></i>
                        <span>${weather.windSpeed} km/h</span>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-compress"></i>
                        <span>${weather.pressure} hPa</span>
                    </div>
                    <div class="weather-detail">
                        <i class="fas fa-eye"></i>
                        <span>${weather.visibility} km</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadCryptoData() {
        try {
            // Simulate API call with mock data
            const cryptoData = this.generateMockCryptoData();
            this.cryptoData = cryptoData;
            this.renderCryptoData(cryptoData);
        } catch (error) {
            console.error('Error loading crypto data:', error);
        }
    }

    generateMockCryptoData() {
        const cryptocurrencies = [
            { symbol: 'BTC', name: 'Bitcoin' },
            { symbol: 'ETH', name: 'Ethereum' },
            { symbol: 'BNB', name: 'Binance Coin' },
            { symbol: 'SOL', name: 'Solana' },
            { symbol: 'ADA', name: 'Cardano' },
            { symbol: 'XRP', name: 'Ripple' },
            { symbol: 'DOT', name: 'Polkadot' },
            { symbol: 'DOGE', name: 'Dogecoin' },
            { symbol: 'AVAX', name: 'Avalanche' },
            { symbol: 'MATIC', name: 'Polygon' },
            { symbol: 'LINK', name: 'Chainlink' },
            { symbol: 'UNI', name: 'Uniswap' }
        ];

        return cryptocurrencies.map(crypto => ({
            ...crypto,
            price: Math.random() * 50000 + 100,
            change24h: (Math.random() - 0.5) * 20,
            volume24h: Math.random() * 1000000000 + 100000000,
            marketCap: Math.random() * 1000000000000 + 10000000000,
            circulatingSupply: Math.random() * 1000000000 + 10000000,
            isFavorite: this.favorites.has(crypto.symbol)
        }));
    }

    renderCryptoData(data) {
        const cryptoGrid = document.getElementById('crypto-grid');
        cryptoGrid.innerHTML = data.map(crypto => `
            <div class="crypto-card">
                <div class="crypto-header">
                    <div>
                        <div class="crypto-name">${crypto.name}</div>
                        <div class="crypto-symbol">${crypto.symbol}</div>
                    </div>
                    <button class="crypto-favorite ${crypto.isFavorite ? 'active' : ''}" data-symbol="${crypto.symbol}">
                        <i class="${crypto.isFavorite ? 'fas' : 'far'} fa-star"></i>
                    </button>
                </div>
                <div class="crypto-price">$${crypto.price.toFixed(2)}</div>
                <div class="crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-arrow-${crypto.change24h >= 0 ? 'up' : 'down'}"></i>
                    <span>${Math.abs(crypto.change24h).toFixed(2)}%</span>
                </div>
                <div class="crypto-stats">
                    <div class="crypto-stat">
                        <span class="crypto-stat-label">Volume 24h:</span>
                        <span class="crypto-stat-value">$${this.formatNumber(crypto.volume24h)}</span>
                    </div>
                    <div class="crypto-stat">
                        <span class="crypto-stat-label">Market Cap:</span>
                        <span class="crypto-stat-value">$${this.formatNumber(crypto.marketCap)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add favorite toggle listeners
        document.querySelectorAll('.crypto-favorite').forEach(btn => {
            btn.addEventListener('click', () => {
                const symbol = btn.dataset.symbol;
                if (this.favorites.has(symbol)) {
                    this.favorites.delete(symbol);
                    btn.classList.remove('active');
                    btn.querySelector('i').className = 'far fa-star';
                } else {
                    this.favorites.add(symbol);
                    btn.classList.add('active');
                    btn.querySelector('i').className = 'fas fa-star';
                }
            });
        });
    }

    filterCryptoData() {
        const filter = document.getElementById('crypto-filter').value;
        let filteredData = [...this.cryptoData];

        switch (filter) {
            case 'top10':
                filteredData = filteredData.sort((a, b) => b.marketCap - a.marketCap).slice(0, 10);
                break;
            case 'favorites':
                filteredData = filteredData.filter(crypto => crypto.isFavorite);
                break;
        }

        this.renderCryptoData(filteredData);
    }

    async loadStockData() {
        try {
            // Simulate API call with mock data
            const stockData = this.generateMockStockData();
            this.renderStockData(stockData);
        } catch (error) {
            console.error('Error loading stock data:', error);
        }
    }

    generateMockStockData() {
        const stocks = [
            { symbol: 'AAPL', name: 'Apple Inc.' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.' },
            { symbol: 'MSFT', name: 'Microsoft Corporation' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.' },
            { symbol: 'TSLA', name: 'Tesla Inc.' },
            { symbol: 'META', name: 'Meta Platforms Inc.' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation' },
            { symbol: 'JPM', name: 'JPMorgan Chase & Co.' }
        ];

        const marketValue = 15000 + Math.random() * 2000;
        const marketChange = (Math.random() - 0.5) * 500;

        return {
            overview: {
                value: marketValue,
                change: marketChange,
                changePercent: (marketChange / marketValue) * 100,
                volume: Math.random() * 5000000000 + 1000000000,
                high: marketValue + Math.abs(marketChange),
                low: marketValue - Math.abs(marketChange)
            },
            stocks: stocks.map(stock => ({
                ...stock,
                price: Math.random() * 500 + 50,
                change: (Math.random() - 0.5) * 10,
                volume: Math.random() * 10000000 + 1000000
            }))
        };
    }

    renderStockData(data) {
        // Render market overview
        const marketOverview = document.getElementById('market-overview');
        marketOverview.innerHTML = `
            <div class="market-title">Market Overview</div>
            <div class="market-value">${data.overview.value.toFixed(2)}</div>
            <div class="market-change ${data.overview.change >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-arrow-${data.overview.change >= 0 ? 'up' : 'down'}"></i>
                <span>${Math.abs(data.overview.change).toFixed(2)} (${Math.abs(data.overview.changePercent).toFixed(2)}%)</span>
            </div>
            <div class="market-details">
                <div class="market-detail">
                    <span>Volume</span>
                    <span>$${this.formatNumber(data.overview.volume)}</span>
                </div>
                <div class="market-detail">
                    <span>High</span>
                    <span>${data.overview.high.toFixed(2)}</span>
                </div>
                <div class="market-detail">
                    <span>Low</span>
                    <span>${data.overview.low.toFixed(2)}</span>
                </div>
                <div class="market-detail">
                    <span>Change</span>
                    <span>${Math.abs(data.overview.change).toFixed(2)}</span>
                </div>
            </div>
        `;

        // Render individual stocks
        const stocksGrid = document.getElementById('stocks-grid');
        stocksGrid.innerHTML = data.stocks.map(stock => `
            <div class="stock-card">
                <div class="stock-symbol">${stock.symbol}</div>
                <div class="stock-name">${stock.name}</div>
                <div class="stock-price">$${stock.price.toFixed(2)}</div>
                <div class="stock-change ${stock.change >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-arrow-${stock.change >= 0 ? 'up' : 'down'}"></i>
                    <span>${Math.abs(stock.change).toFixed(2)}%</span>
                </div>
            </div>
        `).join('');
    }

    async loadNewsData() {
        try {
            // Simulate API call with mock data
            const newsData = this.generateMockNewsData();
            this.renderNewsData(newsData);
        } catch (error) {
            console.error('Error loading news data:', error);
        }
    }

    generateMockNewsData() {
        const headlines = [
            'Tech Stocks Rally as AI Innovation Continues',
            'Cryptocurrency Market Shows Strong Recovery',
            'Federal Reserve Announces New Policy Changes',
            'Oil Prices Surge Amid Supply Concerns',
            'Global Markets React to Economic Data',
            'Bitcoin Reaches New Monthly High',
            'Apple Unveils Revolutionary New Product',
            'Electric Vehicle Sales Hit Record Numbers'
        ];

        const sources = ['TechCrunch', 'Reuters', 'Bloomberg', 'CoinDesk', 'WSJ'];
        const categories = ['crypto', 'stocks', 'tech'];

        return headlines.map((headline, index) => ({
            id: index + 1,
            title: headline,
            source: sources[Math.floor(Math.random() * sources.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            time: this.generateRandomTime(),
            image: `https://picsum.photos/seed/news${index}/400/250`
        }));
    }

    generateRandomTime() {
        const minutes = Math.floor(Math.random() * 60);
        const hours = Math.floor(Math.random() * 24);
        
        if (minutes < 60) {
            return `${minutes} min ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else {
            return '1 day ago';
        }
    }

    renderNewsData(data) {
        const filter = document.getElementById('news-source').value;
        let filteredData = data;

        if (filter !== 'all') {
            filteredData = data.filter(news => news.category === filter);
        }

        const newsFeed = document.getElementById('news-feed');
        newsFeed.innerHTML = filteredData.map(news => `
            <div class="news-item">
                <div class="news-image">
                    <img src="${news.image}" alt="${news.title}">
                </div>
                <div class="news-content">
                    <div class="news-title">${news.title}</div>
                    <div class="news-meta">
                        <span class="news-source">${news.source}</span>
                        <span class="news-time">${news.time}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    initializeCharts() {
        this.initPriceChart();
        this.initVolumeChart();
        this.updateMetrics();
    }

    initPriceChart() {
        const ctx = document.getElementById('price-chart').getContext('2d');
        this.charts.price = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Price',
                    data: this.generateRandomPrices(),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    initVolumeChart() {
        const ctx = document.getElementById('volume-chart').getContext('2d');
        this.charts.volume = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.generateTimeLabels(),
                datasets: [{
                    label: 'Volume',
                    data: this.generateRandomVolumes(),
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return this.formatNumber(value);
                            }.bind(this)
                        }
                    }
                }
            }
        });
    }

    updateMetrics() {
        const metrics = [
            { label: 'Total Volume', value: '$2.5B', change: '+12.5%', positive: true },
            { label: 'Active Traders', value: '45.2K', change: '+8.3%', positive: true },
            { label: 'Market Cap', value: '$850B', change: '-2.1%', positive: false },
            { label: '24h High', value: '$52,450', change: '+5.2%', positive: true }
        ];

        const metricsGrid = document.getElementById('metrics-grid');
        metricsGrid.innerHTML = metrics.map(metric => `
            <div class="metric-item">
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value">${metric.value}</div>
                <div class="metric-change ${metric.positive ? 'positive' : 'negative'}">
                    <i class="fas fa-arrow-${metric.positive ? 'up' : 'down'}"></i>
                    ${metric.change}
                </div>
            </div>
        `).join('');
    }

    updateCharts() {
        const timeRange = document.getElementById('time-range').value;
        
        // Update chart data based on time range
        const dataPoints = this.getDataPointsForTimeRange(timeRange);
        
        this.charts.price.data.labels = dataPoints.labels;
        this.charts.price.data.datasets[0].data = dataPoints.prices;
        this.charts.price.update();
        
        this.charts.volume.data.labels = dataPoints.labels;
        this.charts.volume.data.datasets[0].data = dataPoints.volumes;
        this.charts.volume.update();
    }

    getDataPointsForTimeRange(timeRange) {
        let points = 24;
        
        switch (timeRange) {
            case '1h':
                points = 12;
                break;
            case '24h':
                points = 24;
                break;
            case '7d':
                points = 7;
                break;
            case '30d':
                points = 30;
                break;
        }
        
        return {
            labels: this.generateTimeLabels(points),
            prices: this.generateRandomPrices(points),
            volumes: this.generateRandomVolumes(points)
        };
    }

    generateTimeLabels(count = 24) {
        const labels = [];
        const now = new Date();
        
        for (let i = count - 1; i >= 0; i--) {
            const time = new Date(now - i * 60 * 60 * 1000);
            labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        }
        
        return labels;
    }

    generateRandomPrices(count = 24) {
        const prices = [];
        let basePrice = 50000;
        
        for (let i = 0; i < count; i++) {
            basePrice += (Math.random() - 0.5) * 2000;
            prices.push(Math.max(1000, basePrice));
        }
        
        return prices;
    }

    generateRandomVolumes(count = 24) {
        const volumes = [];
        
        for (let i = 0; i < count; i++) {
            volumes.push(Math.random() * 100000000 + 10000000);
        }
        
        return volumes;
    }

    toggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        const statusElement = document.getElementById('auto-refresh-status');
        
        if (this.autoRefreshEnabled) {
            statusElement.textContent = 'ON';
            this.autoRefreshInterval = setInterval(() => {
                this.loadAllData();
            }, 30000); // Refresh every 30 seconds
        } else {
            statusElement.textContent = 'OFF';
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = null;
            }
        }
    }

    formatNumber(num) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toFixed(0);
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('active');
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-modal').classList.add('active');
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiveDataDashboard();
});
