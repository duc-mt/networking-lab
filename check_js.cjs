const fs = require('fs');
const html = fs.readFileSync('projects/protocol/bgp-peering.html', 'utf8');
const scriptMatch = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
if (scriptMatch) {
    const script = scriptMatch[1];
    try {
        new Function(script);
        console.log('No syntax errors.');
    } catch (e) {
        console.error('Syntax Error:', e);
    }
}
