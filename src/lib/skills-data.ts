export type Level = {
  level: number;
  title: string;
  challengeType: string;
  example: string;
  isCompleted?: boolean;
};

export type Tier = {
  tier: number;
  title: string;
  focus: string;
  goal: string;
  levels: Level[];
};

export type SkillTrack = {
  slug: string;
  title:string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Technical' | 'Soft Skill';
  imageId: string;
  journey: Tier[];
};

export const skillTracks: Omit<SkillTrack, 'journey'>[] = [
  {
    slug: 'python-for-data-science',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis and machine learning.',
    level: 'Intermediate',
    category: 'Technical',
    imageId: 'skill-python',
  },
  {
    slug: 'public-speaking-mastery',
    title: 'Public Speaking Mastery',
    description: 'Learn to deliver compelling presentations with confidence.',
    level: 'Beginner',
    category: 'Soft Skill',
    imageId: 'skill-public-speaking',
  },
  {
    slug: 'ui-ux-design-fundamentals',
    title: 'UI/UX Design Fundamentals',
    description: 'Understand the principles of creating user-friendly digital products.',
    level: 'Beginner',
    category: 'Technical',
    imageId: 'skill-ui-ux',
  },
  {
    slug: 'agile-project-management',
    title: 'Agile Project Management',
    description: 'Lead projects effectively with agile methodologies.',
    level: 'Advanced',
    category: 'Soft Skill',
    imageId: 'skill-project-management',
  },
];

export const skillsData: Record<string, SkillTrack> = {
  'python-for-data-science': {
    slug: 'python-for-data-science',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis and machine learning.',
    level: 'Intermediate',
    category: 'Technical',
    imageId: 'skill-python',
    journey: [
      {
        tier: 1,
        title: 'Foundation',
        focus: 'Syntax, data types, operators, loops, conditionals.',
        goal: 'Comfort with basics.',
        levels: [
          { level: 1, title: 'Variables & Data Types', challengeType: 'Quiz', example: 'Declare an integer and a string variable.' },
          { level: 2, title: 'Basic Operators', challengeType: 'Quiz', example: 'Calculate the sum of two numbers.' },
          { level: 3, title: 'Conditional Statements', challengeType: 'Simple Exercise', example: 'Write an if-else statement to check if a number is positive.' },
          { level: 4, title: 'For Loops', challengeType: 'Simple Exercise', example: 'Write a loop to print even numbers up to 20.' },
          { level: 5, title: 'While Loops', challengeType: 'Simple Exercise', example: 'Write a loop that runs as long as a variable is less than 10.' },
          { level: 6, title: 'Debugging Snippets I', challengeType: 'Debugging', example: 'Find and fix the error in a simple Python script.' },
          { level: 7, title: 'Lists', challengeType: 'Simple Exercise', example: 'Create a list of fruits and print the second fruit.' },
          { level: 8, title: 'List Methods', challengeType: 'Quiz', example: 'How do you add an item to the end of a list?' },
          { level: 9, title: 'Introduction to Strings', challengeType: 'Simple Exercise', example: 'Concatenate two strings.' },
          { level: 10, title: 'Capstone: Tier 1', challengeType: 'Simple Exercise', example: 'Combine loops and conditionals to print numbers with a condition.' },
        ],
      },
      {
        tier: 2,
        title: 'Application',
        focus: 'Functions, data structures, OOP basics, file handling.',
        goal: 'Apply coding to solve real tasks.',
        levels: [
          { level: 11, title: 'Defining Functions', challengeType: 'Coding Challenge', example: 'Write a function that takes two numbers and returns their product.' },
          { level: 12, title: 'Function Arguments', challengeType: 'Coding Challenge', example: 'Create a function with default argument values.' },
          { level: 13, title: 'Dictionaries', challengeType: 'Coding Challenge', example: 'Create a dictionary of students and marks, then print the topper’s name.' },
          { level: 14, title: 'Tuples and Sets', challengeType: 'Quiz', example: 'What is the main difference between a list and a tuple?' },
          { level: 15, title: 'File Handling: Read', challengeType: 'Short Task', example: 'Read a text file and print its content.' },
          { level: 16, title: 'File Handling: Write', challengeType: 'Short Task', example: 'Write a list of strings to a new text file.' },
          { level: 17, title: 'Intro to OOP: Classes', challengeType: 'Coding Challenge', example: 'Create a simple `Dog` class with a `bark` method.' },
          { level: 18, title: 'Intro to OOP: Objects', challengeType: 'Coding Challenge', example: 'Instantiate an object from your `Dog` class.' },
          { level: 19, title: 'Bug Fixing I', challengeType: 'Bug Fixing', example: 'Fix a bug in a function that is not returning the correct value.' },
          { level: 20, title: 'Capstone: Tier 2', challengeType: 'Short Task', example: 'Write a program that reads a CSV file and calculates a column average.' },
        ],
      },
      {
        tier: 3,
        title: 'Mastery',
        focus: 'Libraries, APIs, problem-solving, mini-projects.',
        goal: 'Be job-ready in that skill.',
        levels: [
            { level: 21, title: 'NumPy Basics', challengeType: 'Real-world Task', example: 'Create a NumPy array and perform a vectorized operation.' },
            { level: 22, title: 'Pandas DataFrames', challengeType: 'Real-world Task', example: 'Load a CSV into a pandas DataFrame and display the first 5 rows.' },
            { level: 23, title: 'Data Cleaning with Pandas', challengeType: 'Real-world Task', example: 'Handle missing values in a DataFrame.' },
            { level: 24, title: 'Data Visualization with Matplotlib', challengeType: 'Real-world Task', example: 'Create a simple line plot from a list of numbers.' },
            { level: 25, title: 'Introduction to APIs', challengeType: 'API Usage', example: 'Make a GET request to a public API and print the response.' },
            { level: 26, title: 'Working with JSON', challengeType: 'API Usage', example: 'Parse a JSON response from an API.' },
            { level: 27, title: 'Mini-Project: Data Analysis', challengeType: 'Full Program', example: 'Analyze a small dataset and present findings with plots.' },
            { level: 28, title: 'Advanced Problem-Solving', challengeType: 'Full Program', example: 'Solve a complex algorithmic challenge.' },
            { level: 29, title: 'Mini-Project: API App', challengeType: 'Full Program', example: 'Build a weather app that fetches live data using an API.' },
            { level: 30, title: 'Final Capstone Project', challengeType: 'Real-world Project', example: 'Build a complete data analysis project from scratch.' },
        ],
      },
    ],
  },
  'public-speaking-mastery': {
    slug: 'public-speaking-mastery',
    title: 'Public Speaking Mastery',
    description: 'Learn to deliver compelling presentations with confidence.',
    level: 'Beginner',
    category: 'Soft Skill',
    imageId: 'skill-public-speaking',
    journey: [
      {
        tier: 1,
        title: 'Awareness',
        focus: 'Theoretical basics of communication, teamwork, confidence.',
        goal: 'Understand key principles.',
        levels: [
          { level: 1, title: 'The 3 Vs of Communication', challengeType: 'Quiz', example: 'What are the three core components of communication?' },
          { level: 2, title: 'Understanding Your Audience', challengeType: 'Scenario-based Choice', example: 'How would you tailor a speech for engineers vs. artists?' },
          { level: 3, title: 'Structuring a Speech', challengeType: 'Quiz', example: 'What are the key parts of a compelling presentation?' },
          { level: 4, title: 'Overcoming Stage Fright', challengeType: 'Scenario-based Choice', example: 'You feel nervous before a talk. What is the best first step?' },
          { level: 5, title: 'The Role of Body Language', challengeType: 'Quiz', example: 'What does open body language signify?' },
          { level: 6, title: 'Handling Difficult Questions', challengeType: 'Scenario-based Choice', example: 'An audience member asks a hostile question. What do you do?' },
          { level: 7, title: 'Basics of Storytelling', challengeType: 'Quiz', example: 'Why are stories effective in presentations?' },
          { level: 8, title: 'Active Listening in a Team', challengeType: 'Scenario-based Choice', example: 'In a team meeting, two members fight. What would you do?' },
          { level: 9, title: 'Giving Constructive Feedback', challengeType: 'Quiz', example: 'What is the "sandwich method" for giving feedback?' },
          { level: 10, title: 'Capstone: Tier 1', challengeType: 'Scenario-based Choice', example: 'Outline a 3-minute talk for a mixed audience.' },
        ],
      },
      {
        tier: 2,
        title: 'Practice',
        focus: 'Apply skills in AI-driven practice.',
        goal: 'Practice real-world scenarios.',
        levels: [
          { level: 11, title: 'Record a Self-Introduction', challengeType: 'Audio Recording', example: 'Record a 30-second audio clip introducing yourself.' },
          { level: 12, title: 'The Elevator Pitch', challengeType: 'Audio Recording', example: 'Record a 60-second pitch about your final-year project.' },
          { level: 13, title: 'Pace and Filler Words', challengeType: 'Audio Recording', example: 'Read a paragraph; AI will analyze your pace and count filler words.' },
          { level: 14, title: 'Virtual Interview: Strengths', challengeType: 'Interview Q&A', example: 'Answer the question: "What are your biggest strengths?"' },
          { level: 15, title: 'Virtual Interview: Weaknesses', challengeType: 'Interview Q&A', example: 'Answer the question: "What is your greatest weakness?"' },
          { level: 16, title: 'Teamwork Simulation I', challengeType: 'Teamwork Simulation', example: 'An AI teammate disagrees with your idea. Persuade them.' },
          { level: 17, title: 'Explaining a Technical Concept', challengeType: 'Video Recording', example: 'Record a 2-minute video explaining a simple technical topic.' },
          { level: 18, title: 'Body Language Analysis', challengeType: 'Video Recording', example: 'Deliver a short speech; AI will analyze your posture and gestures.' },
          { level: 19, title: 'Impromptu Speaking I', challengeType: 'Audio Recording', example: 'Speak for 60 seconds on a random topic given by the AI.' },
          { level: 20, title: 'Capstone: Tier 2', challengeType: 'Video Recording', example: 'Record a 3-minute presentation on a topic of your choice.' },
        ],
      },
      {
        tier: 3,
        title: 'Advanced Scenarios',
        focus: 'Leadership, adaptability, handling pressure.',
        goal: 'Become workplace-ready.',
        levels: [
          { level: 21, title: 'Debate Simulation', challengeType: 'Debate', example: 'Debate against an AI on a given topic.' },
          { level: 22, title: 'Presentation with Q&A', challengeType: 'Presentation', example: 'Deliver a 5-min presentation; AI asks 3 tough questions.' },
          { level: 23, title: 'Negotiation Simulation', challengeType: 'Negotiation', example: 'Negotiate a project deadline with an AI project manager.' },
          { level: 24, title: 'Handling a "Hostile" Audience', challengeType: 'Presentation', example: 'Present an unpopular opinion and defend it against AI counter-arguments.' },
          { level: 25, title: 'Crisis Communication', challengeType: 'Simulation', example: 'An AI simulates a project crisis. Deliver a calming and clear update.' },
          { level: 26, title: 'Leading a Team Meeting', challengeType: 'Simulation', example: 'Lead a simulated meeting with two AI teammates to a decision.' },
          { level: 27, title: 'Persuasive Storytelling', challengeType: 'Presentation', example: 'Craft and deliver a persuasive story with a clear call to action.' },
          { level: 28, title: 'Adapting on the Fly', challengeType: 'Presentation', example: 'The AI will interrupt your presentation with a major change. Adapt your talk.' },
          { level: 29, title: 'Keynote Address Practice', challengeType: 'Presentation', example: 'Deliver the opening of a 10-minute keynote speech.' },
          { level: 30, title: 'Final Capstone Project', challengeType: 'Real-world Project', example: 'Prepare and deliver a full 10-minute presentation with slides and handle a live Q&A with the AI.' },
        ],
      },
    ],
  },
};
