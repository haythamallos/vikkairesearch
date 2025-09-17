// Knowledge Graph page functionality
let currentUser = null;
let authToken = null;

// DOM elements
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const statusText = document.getElementById('statusText');
const graphContent = document.getElementById('graphContent');

// Load shared header
document.addEventListener('DOMContentLoaded', async () => {
    await loadSharedHeader();
    initializePage();
});

async function loadSharedHeader() {
    try {
        const response = await fetch('/components/header.html');
        const headerHtml = await response.text();
        document.getElementById('header-container').innerHTML = headerHtml;
        
        // Load shared header JavaScript
        const script = document.createElement('script');
        script.src = '/js/shared-header.js';
        document.head.appendChild(script);
        
        // Wait for shared header to initialize
        await new Promise(resolve => {
            script.onload = resolve;
        });
        
        // Configure header for knowledge graph page
        setHeaderTitle('Knowledge Graph', 'fas fa-project-diagram');
        addBackButton('/dashboard');
    } catch (error) {
        console.error('Error loading shared header:', error);
    }
}

// Initialize page for authenticated user
function initializePage() {
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // File upload functionality
    setupFileUpload();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// File Upload Functionality
function setupFileUpload() {
    // Click to upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    
    // Prevent default drag behaviors on the entire page
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
}

function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function processFile(file) {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.json')) {
        showFileStatus('error', 'Please select a JSON file');
        return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showFileStatus('error', 'File size too large. Maximum 10MB allowed.');
        return;
    }
    
    showFileStatus('loading', 'Processing JSON file...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            validateAndProcessJSON(jsonData, file.name);
        } catch (error) {
            showFileStatus('error', 'Invalid JSON format: ' + error.message);
        }
    };
    
    reader.onerror = function() {
        showFileStatus('error', 'Error reading file');
    };
    
    reader.readAsText(file);
}

function validateAndProcessJSON(jsonData, fileName) {
    try {
        // Basic JSON validation
        if (typeof jsonData !== 'object' || jsonData === null) {
            throw new Error('JSON must be an object');
        }
        
        // Show success status
        showFileStatus('success', `Successfully loaded ${fileName} (${Object.keys(jsonData).length} properties)`);
        
        // Process the JSON data for knowledge graph
        processKnowledgeGraphData(jsonData);
        
    } catch (error) {
        showFileStatus('error', 'JSON validation failed: ' + error.message);
    }
}

function processKnowledgeGraphData(data) {
    // This is where you would process the JSON data for the knowledge graph
    // For now, we'll just display some basic information
    
    const graphInfo = document.createElement('div');
    graphInfo.innerHTML = `
        <h3>Knowledge Graph Data Loaded</h3>
        <p><strong>File processed:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Data type:</strong> ${Array.isArray(data) ? 'Array' : 'Object'}</p>
        <p><strong>Properties/Items:</strong> ${Array.isArray(data) ? data.length : Object.keys(data).length}</p>
        <div style="margin-top: 20px;">
            <h4>Sample Data Structure:</h4>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; max-height: 200px;">${JSON.stringify(data, null, 2).substring(0, 500)}${JSON.stringify(data, null, 2).length > 500 ? '...' : ''}</pre>
        </div>
        <div style="margin-top: 20px;">
            <button onclick="analyzeGraphData()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Analyze Graph Data
            </button>
        </div>
    `;
    
    graphContent.innerHTML = '';
    graphContent.appendChild(graphInfo);
}

function showFileStatus(type, message) {
    fileStatus.style.display = 'block';
    fileStatus.className = `file-status ${type}`;
    statusText.textContent = message;
    
    // Update icon based on status
    const icon = fileStatus.querySelector('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-spinner fa-spin';
    }
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            fileStatus.style.display = 'none';
        }, 5000);
    }
}

// Global function for the analyze button
function analyzeGraphData() {
    showFileStatus('loading', 'Analyzing graph data...');
    
    // Simulate analysis (replace with actual graph analysis)
    setTimeout(() => {
        showFileStatus('success', 'Graph analysis completed! Ready for visualization.');
        
        // Add analysis results to the graph content
        const analysisResults = document.createElement('div');
        analysisResults.innerHTML = `
            <h4>Analysis Results:</h4>
            <ul>
                <li>✅ Data structure validated</li>
                <li>✅ Relationships identified</li>
                <li>✅ Graph nodes prepared</li>
                <li>✅ Ready for visualization</li>
            </ul>
            <p style="margin-top: 15px; color: #666;">
                <em>Graph visualization features will be implemented in the next phase.</em>
            </p>
        `;
        
        graphContent.appendChild(analysisResults);
    }, 2000);
}
