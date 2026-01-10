import Member from '../models/Member.js';

// Helper function: Find path to Jedi
async function findPathToJedi(personName, visited = new Set()) {
  if (visited.has(personName)) return null;
  visited.add(personName);

  const person = await Member.findOne({ name: personName });
  if (!person) return null;
  if (person.isJedi) return [personName];
  if (!person.endorsedBy) return null;

  const path = await findPathToJedi(person.endorsedBy, visited);
  return path ? [personName, ...path] : null;
}

// Helper function: Get all descendants
async function getAllDescendants(personName) {
  const descendants = [];
  const queue = [personName];

  while (queue.length > 0) {
    const current = queue.shift();
    const person = await Member.findOne({ name: current });
    
    if (person && person.endorses) {
      for (const endorsed of person.endorses) {
        descendants.push(endorsed);
        queue.push(endorsed);
      }
    }
  }

  return descendants;
}

export { findPathToJedi, getAllDescendants };