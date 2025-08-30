// static/js/script.js
document.getElementById('validateButton').addEventListener('click', function() {
  const resultsPane = document.getElementById('resultsPane');
  resultsPane.innerHTML = '<p class="text-gray-500">Processing...</p>';

  const formData = new FormData();
  formData.append('schema', document.getElementById('schemaFile').files[0]);
  for (let file of document.getElementById('validFiles').files) {
    formData.append('valid', file);
  }
  for (let file of document.getElementById('invalidFiles').files) {
    formData.append('invalid', file);
  }

  if (!document.getElementById('schemaFile').files[0] || (!document.getElementById('validFiles').files.length && !document.getElementById('invalidFiles').files.length)) {
    resultsPane.innerHTML = '<p class="text-red-500">Please select a schema file and at least one XML file.</p>';
    return;
  }

  // Backend integration
  fetch('/validate', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    let output = `<p class="text-green-600">${data.schema}</p>`;
    output += '<h3 class="mt-4 text-lg font-semibold text-gray-900">Valid Files:</h3>';
    data.valid.forEach(result => {
      output += `<div class="results-highlight p-2 mt-2 rounded-md">${result.name}: <span class="${result.status === 'VALID' ? 'text-green-600' : 'text-red-600'} font-medium">${result.status}</span></div>`;
      if (result.error) output += `<p class="text-red-600 text-sm mt-1">${result.error}</p>`;
    });
    output += '<h3 class="mt-4 text-lg font-semibold text-gray-900">Invalid Files:</h3>';
    data.invalid.forEach(result => {
      output += `<div class="results-highlight p-2 mt-2 rounded-md">${result.name}: <span class="${result.status === 'VALID' ? 'text-green-600' : 'text-red-600'} font-medium">${result.status}</span></div>`;
      if (result.error) output += `<p class="text-red-600 text-sm mt-1">${result.error}</p>`;
    });
    resultsPane.innerHTML = output;
  })
  .catch(error => {
    resultsPane.innerHTML = `<p class="text-red-600">Error: ${error}</p>`;
  });
});