/**
 * Utility for tracking story status history
 */

export function appendStatusHistory(story, trigger, newStatus) {
  const timestamp = new Date().toISOString();
  const history = story.frontmatter.status_history || [];
  
  // Handle legacy
  if (!story.frontmatter.status_history) {
    // legacy initialization
  }

  let actor = 'human';
  if (trigger.includes('agent')) actor = 'agent';
  else if (trigger.includes('skill')) actor = 'skill';
  else if (trigger === 'system') actor = 'system';

  const entry = {
    from: story.frontmatter.status || null,
    to: newStatus,
    timestamp,
    trigger,
    actor
  };

  return {
    ...story,
    frontmatter: {
      ...story.frontmatter,
      status: newStatus,
      updated: timestamp,
      status_history: [...history, entry]
    }
  };
}

export function validateManualEdit(story) {
  const history = story.frontmatter.status_history || [];
  if (history.length === 0) return true;
  
  const lastEntry = history[history.length - 1];
  if (lastEntry.to !== story.frontmatter.status) {
    return false; // discrepancy detected
  }
  return true;
}
