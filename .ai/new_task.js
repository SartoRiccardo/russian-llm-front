import fs from 'fs/promises';
import path from 'path';

async function main() {
  const taskName = process.argv.slice(2).join(' ');

  if (!taskName) {
    console.error('Usage: npm run task:new -- <task name>');
    process.exit(1);
  }

  const checklistFile = path.join('.ai', 'CHECKLIST.md');
  const tasksDir = path.join('.ai', 'tasks');

  await fs.mkdir(tasksDir, { recursive: true });

  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const datePrefix = `${year}_${month}_${day}`;

  const files = await fs.readdir(tasksDir);
  const todayFiles = files.filter(file => file.startsWith(datePrefix));
  const index = todayFiles.length + 1;
  const indexPadded = index.toString().padStart(2, '0');

  const checklistEntry = `- [ ] ${year}/${month}/${day} (${indexPadded}) ${taskName}`;

  let checklistContent = '';
  try {
    checklistContent = await fs.readFile(checklistFile, 'utf-8');
  } catch (error) {
    // file doesn't exist, ignore
  }

  if (checklistContent.length > 0 && !checklistContent.endsWith('\n')) {
    checklistContent += '\n';
  }
  checklistContent += `${checklistEntry}\n`;

  await fs.writeFile(checklistFile, checklistContent);

  const snakeCaseTaskName = taskName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const taskFileName = `${datePrefix}_${indexPadded}_${snakeCaseTaskName}.md`;
  const taskFilePath = path.join(tasksDir, taskFileName);

  await fs.writeFile(taskFilePath, `# ${year}/${month}/${day} (${indexPadded}) ${taskName}
`);

  console.log(`Created task file: ${taskFilePath}`);
  console.log(`Updated checklist: ${checklistFile}`);
}

main().catch(console.error);
