// Global array and canvas setup
let array = [];
const canvasOriginal = document.getElementById('original-array');
const canvasSortingProcess = document.getElementById('sorting-process');
const canvasFinal = document.getElementById('final-array');
const ctxOriginal = canvasOriginal.getContext('2d');
const ctxSortingProcess = canvasSortingProcess.getContext('2d');
const ctxFinal = canvasFinal.getContext('2d');

// Function to generate a random array
function generateRandomArray(size = 10, max = 100) {
    array = Array.from({ length: size }, () => Math.floor(Math.random() * max));
    drawArray(ctxOriginal, array);
    clearCanvas(ctxSortingProcess);
    clearCanvas(ctxFinal);
}

// Function to draw the array as bars (for original and final array)
function drawArray(ctx, array, highlight = -1) {
    clearCanvas(ctx);
    const width = canvasOriginal.width / array.length;
    for (let i = 0; i < array.length; i++) {
        ctx.fillStyle = (i === highlight) ? '#C7253E' : '#007F73'; // Highlighting during sorting
        ctx.fillRect(i * width, canvasOriginal.height - array[i] * 2, width - 2, array[i] * 2);
        ctx.fillStyle = '#000000'; // Black for the text
        ctx.fillText(array[i], i * width + width / 4, canvasOriginal.height - 5); // Number below the bar
    }
}

// Function to draw circles with numbers during sorting
function drawArrayCircles(ctx, array, highlight = -1) {
    clearCanvas(ctx);
    const radius = canvasSortingProcess.width / (array.length * 3);
    const centerY = canvasSortingProcess.height / 2;

    for (let i = 0; i < array.length; i++) {
        ctx.beginPath();
        ctx.arc(i * radius * 3 + radius, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = (i === highlight) ? '#C7253E' : '#007F73'; // Highlighted circle
        ctx.fill();
        ctx.fillStyle = '#FFFFFF'; // White for the number inside
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        ctx.fillText(array[i], i * radius * 3 + radius, centerY); // Number inside the circle
    }
}

// Clear the canvas
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvasOriginal.width, canvasOriginal.height);
}

// Sorting Visualizations
// Bubble Sort Algorithm
async function bubbleSort() {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            drawArrayCircles(ctxSortingProcess, arr, j);
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
            await sleep(200); // For visualization
        }
    }
    drawArray(ctxFinal, arr);
}

// Selection Sort Algorithm
async function selectionSort() {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            drawArrayCircles(ctxSortingProcess, arr, j);
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
            await sleep(200); // For visualization
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]; // Swap
    }
    drawArray(ctxFinal, arr);
}

// Insertion Sort Algorithm
async function insertionSort() {
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            drawArrayCircles(ctxSortingProcess, arr, j);
            await sleep(200); // For visualization
        }
        arr[j + 1] = key;
    }
    drawArray(ctxFinal, arr);
}

// Quick Sort Algorithm
async function quickSort(arr = [...array], low = 0, high = array.length - 1) {
    if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
    drawArray(ctxFinal, arr);
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        drawArrayCircles(ctxSortingProcess, arr, j);
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
        await sleep(200); // For visualization
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap
    return i + 1;
}

// Merge Sort Algorithm
async function mergeSort(arr = [...array], l = 0, r = array.length - 1) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
    drawArray(ctxFinal, arr);
}

async function merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let left = new Array(n1);
    let right = new Array(n2);

    for (let i = 0; i < n1; i++) left[i] = arr[l + i];
    for (let i = 0; i < n2; i++) right[i] = arr[m + 1 + i];

    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        drawArrayCircles(ctxSortingProcess, arr, k);
        if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
        } else {
            arr[k] = right[j];
            j++;
        }
        k++;
        await sleep(200); // For visualization
    }

    while (i < n1) {
        arr[k] = left[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = right[j];
        j++;
        k++;
    }
}

// Helper function to add sleep for visualization
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Handling the sorting and array generation events
document.getElementById('generate-array').addEventListener('click', function() {
    generateRandomArray();
});

document.getElementById('start-sorting').addEventListener('click', async function() {
    const algorithm = document.getElementById('algorithm-select').value;
    switch (algorithm) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'selectionSort':
            await selectionSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'quickSort':
            await quickSort();
            break;
        case 'mergeSort':
            await mergeSort();
            break;
        default:
            alert('Please select a sorting algorithm.');
    }
});

document.getElementById('try-another-sort-btn').addEventListener('click', function() {
    generateRandomArray();
});

// Algorithm descriptions
const algorithmDescriptions = {
    bubbleSort: `Bubble Sort: A simple comparison-based algorithm that repeatedly swaps adjacent elements if they are in the wrong order.
                 Time Complexity: Best: O(n), Worst: O(n²)
                 Real-life example: Sorting short lists or small datasets in teaching and initial learning environments.`,
    selectionSort: `Selection Sort: An algorithm that selects the smallest (or largest) element from an unsorted portion and swaps it with the first unsorted element.
                    Time Complexity: Best and Worst: O(n²)
                    Real-life example: Used when memory writes are more expensive than reads (e.g., EEPROM programming).`,
    insertionSort: `Insertion Sort: Builds the sorted array one item at a time by inserting elements into their correct positions.
                    Time Complexity: Best: O(n), Worst: O(n²)
                    Real-life example: Sorting playing cards in your hand.`,
    quickSort: `Quick Sort: A divide-and-conquer algorithm that partitions the array into subarrays based on a pivot and sorts them recursively.
                Time Complexity: Best: O(n log n), Worst: O(n²)
                Real-life example: Used in game engines and large datasets where fast sorting is needed.`,
    mergeSort: `Merge Sort: A divide-and-conquer algorithm that splits the array into halves, recursively sorts them, and merges the sorted halves.
                Time Complexity: Best and Worst: O(n log n)
                Real-life example: External sorting for large datasets (e.g., database sorting).`
};

// Update algorithm description based on selection
document.getElementById('algorithm-select').addEventListener('change', function() {
    const selectedAlgorithm = this.value;
    document.getElementById('description-text').innerText = algorithmDescriptions[selectedAlgorithm] || 'Select an algorithm to see its description here.';
});


// Finish button action
document.getElementById('finish-btn').addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirect to start page
});

// Try Another Algorithm button action
document.getElementById('try-another-sort-btn').addEventListener('click', function() {
    generateRandomArray(); // Generate a new array
})