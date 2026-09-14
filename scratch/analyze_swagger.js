const fs = require('fs');
const apiDocs = JSON.parse(fs.readFileSync('scratch/api-docs.json', 'utf8'));

console.log('=== OPENAPI API SPEC OVERVIEW ===');
console.log('Title:', apiDocs.info?.title);
console.log('Version:', apiDocs.info?.version);
console.log('Servers:', JSON.stringify(apiDocs.servers, null, 2));

console.log('\n=== ENDPOINTS ===');
const endpoints = [];
for (const [path, methods] of Object.entries(apiDocs.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    endpoints.push({
      method: method.toUpperCase(),
      path,
      summary: details.summary || details.operationId || '',
      tags: details.tags || [],
      params: details.parameters || [],
      requestBody: details.requestBody || null,
      responses: details.responses || {}
    });
  }
}

endpoints.sort((a, b) => (a.tags[0] || '').localeCompare(b.tags[0] || '') || a.path.localeCompare(b.path));

for (const ep of endpoints) {
  console.log(`[${ep.tags.join(', ')}] ${ep.method} ${ep.path}`);
  if (ep.summary) console.log(`  Summary: ${ep.summary}`);
  if (ep.params.length > 0) {
    console.log('  Parameters:');
    for (const p of ep.params) {
      console.log(`    - ${p.name} (in: ${p.in}, required: ${p.required}, type: ${p.schema?.type || JSON.stringify(p.schema)})`);
    }
  }
  if (ep.requestBody) {
    console.log('  RequestBody:');
    for (const [ct, val] of Object.entries(ep.requestBody.content || {})) {
      console.log(`    Content-Type: ${ct}`);
      console.log(`    Schema: ${JSON.stringify(val.schema)}`);
    }
  }
  console.log('  Responses:');
  for (const [code, resp] of Object.entries(ep.responses)) {
    console.log(`    ${code}: ${resp.description || ''}`);
    if (resp.content) {
      for (const [ct, val] of Object.entries(resp.content)) {
        console.log(`      ${ct}: ${JSON.stringify(val.schema)}`);
      }
    }
  }
  console.log('--------------------------------------------------');
}

console.log('\n=== COMPONENT SCHEMAS ===');
if (apiDocs.components?.schemas) {
  for (const [name, schema] of Object.entries(apiDocs.components.schemas)) {
    console.log(`\n--- Schema: ${name} ---`);
    console.log(JSON.stringify(schema, null, 2));
  }
}
