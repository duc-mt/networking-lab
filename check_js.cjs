const fs = require('fs');
const html = fs.readFileSync('projects/topology-design/evpn-vxlan-mpls-transit.html', 'utf8');
const scriptMatch = html.match(/<script>(.*?)<\/script>/s);
if (scriptMatch) {
    try {
        new Function(scriptMatch[1]);
        console.log("No syntax errors found.");
    } catch (e) {
        console.error("Syntax Error:", e);
    }
}
