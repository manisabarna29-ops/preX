export interface AptitudeQuestion {
  id: string;
  category: 'quant' | 'logical' | 'verbal';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaHint?: string;
}

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // Quantitative Aptitude
  {
    id: 'q-p1',
    category: 'quant',
    topic: 'Percentages',
    difficulty: 'Beginner',
    question: 'If the price of sugar increases by 25%, by what percentage must a family reduce its consumption so that the expenditure remains unchanged?',
    options: ['15%', '20%', '25%', '33.33%'],
    correctIndex: 1,
    explanation: 'Reduction % = [r / (100 + r)] * 100 = [25 / (100 + 25)] * 100 = (25 / 125) * 100 = 20%.',
    formulaHint: 'Percentage Reduction = [r / (100 + r)] * 100%',
  },
  {
    id: 'q-pl1',
    category: 'quant',
    topic: 'Profit and Loss',
    difficulty: 'Intermediate',
    question: 'A shopkeeper sells an article at a discount of 10% on the marked price and still earns a profit of 20%. If the cost price is ₹300, find the marked price.',
    options: ['₹380', '₹400', '₹420', '₹450'],
    correctIndex: 1,
    explanation: 'Selling Price (SP) = CP * (1 + 20/100) = 300 * 1.20 = ₹360. Marked Price (MP) * 0.90 = 360 => MP = 360 / 0.9 = ₹400.',
    formulaHint: 'SP = CP * (1 + P%) = MP * (1 - D%)',
  },
  {
    id: 'q-tw1',
    category: 'quant',
    topic: 'Time and Work',
    difficulty: 'Intermediate',
    question: 'A can complete a project in 12 days, while B can complete it in 18 days. If they work together for 4 days, what fraction of work is left?',
    options: ['1/3', '4/9', '5/9', '2/5'],
    correctIndex: 1,
    explanation: '1 day work = 1/12 + 1/18 = (3 + 2)/36 = 5/36. In 4 days, work done = 4 * 5/36 = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9.',
    formulaHint: 'Combined Rate = 1/A + 1/B',
  },
  {
    id: 'q-prob1',
    category: 'quant',
    topic: 'Probability',
    difficulty: 'Advanced',
    question: 'Two cards are drawn simultaneously from a standard well-shuffled pack of 52 cards. What is the probability that both are aces?',
    options: ['1/221', '1/169', '4/663', '2/221'],
    correctIndex: 0,
    explanation: 'Total cards = 52, Aces = 4. Probability = (4/52) * (3/51) = (1/13) * (1/17) = 1/221.',
    formulaHint: 'P(A and B) = P(A) * P(B|A)',
  },
  {
    id: 'q-ts1',
    category: 'quant',
    topic: 'Time, Speed and Distance',
    difficulty: 'Beginner',
    question: 'A train 180 meters long is traveling at a speed of 72 km/h. How many seconds will it take to pass an electric pole?',
    options: ['7 seconds', '9 seconds', '10 seconds', '12 seconds'],
    correctIndex: 1,
    explanation: 'Speed in m/s = 72 * (5/18) = 20 m/s. Time = Distance / Speed = 180 / 20 = 9 seconds.',
    formulaHint: 'km/h to m/s: multiply by 5/18',
  },

  // Logical Reasoning
  {
    id: 'l-s1',
    category: 'logical',
    topic: 'Number Series',
    difficulty: 'Beginner',
    question: 'What is the next number in the sequence: 4, 9, 25, 49, 121, ___?',
    options: ['144', '169', '196', '225'],
    correctIndex: 1,
    explanation: 'The sequence consists of squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121. The next prime number is 13, and 13^2 = 169.',
  },
  {
    id: 'l-br1',
    category: 'logical',
    topic: 'Blood Relations',
    difficulty: 'Intermediate',
    question: 'Pointing to a gentleman, Deepak said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Deepak?',
    options: ['Father', 'Uncle', 'Grandfather', 'Brother-in-law'],
    correctIndex: 1,
    explanation: 'Deepak\'s daughter\'s father is Deepak himself. Deepak\'s father is the gentleman\'s only brother. Therefore, the gentleman is Deepak\'s paternal uncle.',
  },
  {
    id: 'l-cd1',
    category: 'logical',
    topic: 'Coding-Decoding',
    difficulty: 'Intermediate',
    question: 'In a certain code language, if "SYSTEM" is coded as "SYSMET" and "NEARER" is coded as "AENRER", how is "FRACTION" coded?',
    options: ['CARFNOIT', 'ARFCNOIT', 'CARFTION', 'ACRFITON'],
    correctIndex: 0,
    explanation: 'Divide the word into two equal halves. Reverse the first half and reverse the second half. "FRAC" -> "CARF", "TION" -> "NOIT". Combined = "CARFNOIT".',
  },
  {
    id: 'l-sy1',
    category: 'logical',
    topic: 'Syllogism',
    difficulty: 'Advanced',
    question: 'Statements: (1) All algorithms are logic. (2) Some logic are programs. Conclusions: I. Some algorithms are programs. II. No algorithm is a program.',
    options: ['Only I follows', 'Only II follows', 'Either I or II follows', 'Neither I nor II follows'],
    correctIndex: 2,
    explanation: 'Conclusions I and II form a complementary pair ("Some" and "No") with identical subject and predicate where neither is definitively certain. Hence, Either I or II follows.',
  },

  // Verbal Ability
  {
    id: 'v-sc1',
    category: 'verbal',
    topic: 'Sentence Correction',
    difficulty: 'Beginner',
    question: 'Choose the grammatically correct sentence:',
    options: [
      'Neither the professor nor the students was present in the auditorium.',
      'Neither the professor nor the students were present in the auditorium.',
      'Neither the professor or the students were present in the auditorium.',
      'Neither of the professor nor students were present in the auditorium.',
    ],
    correctIndex: 1,
    explanation: 'In "neither... nor" structures, the verb agrees with the closer subject. Since "the students" is plural and nearest to the verb, "were" is correct.',
  },
  {
    id: 'v-voc1',
    category: 'verbal',
    topic: 'Vocabulary & Synonyms',
    difficulty: 'Intermediate',
    question: 'What is the most accurate synonym for the word "EPHEMERAL"?',
    options: ['Enduring', 'Transient', 'Substantial', 'Luminous'],
    correctIndex: 1,
    explanation: '"Ephemeral" means lasting for a very short time; fleeting or transient. (Antonym: enduring).',
  },
  {
    id: 'v-rc1',
    category: 'verbal',
    topic: 'Reading Comprehension & Critical Reasoning',
    difficulty: 'Advanced',
    question: 'Identify the underlying assumption: "Our company should switch to microservices because cloud providers offer serverless scaling."',
    options: [
      'Monolithic architectures cannot be deployed on cloud providers.',
      'Serverless scaling improves operational efficiency for this company’s specific workload.',
      'All microservices are intrinsically bug-free.',
      'Cloud computing eliminates all infrastructure costs.',
    ],
    correctIndex: 1,
    explanation: 'The argument links serverless scaling to the decision to adopt microservices, which relies on the assumption that such scaling is actually advantageous to the company.',
  },
];

export interface TechnicalQuestion {
  id: string;
  subject: 'DSA' | 'DBMS' | 'OS' | 'CN' | 'OOP';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const TECHNICAL_QUESTIONS: TechnicalQuestion[] = [
  {
    id: 't-dsa1',
    subject: 'DSA',
    topic: 'Binary Search Trees & Balancing',
    difficulty: 'Intermediate',
    question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) with N nodes?',
    options: ['O(log N)', 'O(1)', 'O(N)', 'O(N log N)'],
    correctIndex: 2,
    explanation: 'In the worst case (e.g. inserting elements in strictly sorted order), the BST degenerates into a singly linked list (skewed tree), resulting in O(N) search time.',
  },
  {
    id: 't-dsa2',
    subject: 'DSA',
    topic: 'Sorting Algorithms',
    difficulty: 'Beginner',
    question: 'Which of the following sorting algorithms is inherently stable and guarantees O(N log N) time complexity in the worst case?',
    options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
    correctIndex: 1,
    explanation: 'Merge Sort guarantees O(N log N) in best, average, and worst cases, and preserves the relative order of records with equal keys (stable). Heap Sort is O(N log N) but not stable.',
  },
  {
    id: 't-dbms1',
    subject: 'DBMS',
    topic: 'ACID Properties & Transactions',
    difficulty: 'Intermediate',
    question: 'Which ACID property ensures that the database remains in a valid state before and after the execution of a transaction?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctIndex: 1,
    explanation: 'Consistency ensures that all database integrity constraints, cascades, and trigger invariants are satisfied before and after a transaction commits.',
  },
  {
    id: 't-dbms2',
    subject: 'DBMS',
    topic: 'SQL Joins & Grouping',
    difficulty: 'Intermediate',
    question: 'In SQL, what is the difference between WHERE and HAVING clauses?',
    options: [
      'WHERE applies to aggregate functions; HAVING filters individual rows.',
      'WHERE filters individual rows before grouping; HAVING filters aggregated groups.',
      'HAVING can only be used with SELECT * queries.',
      'There is no functional difference; they are interchangeable aliases.',
    ],
    correctIndex: 1,
    explanation: 'WHERE filters rows before any GROUP BY aggregation takes place. HAVING is applied after grouping to filter grouped results based on aggregate calculations (e.g., HAVING COUNT(*) > 5).',
  },
  {
    id: 't-os1',
    subject: 'OS',
    topic: 'Deadlocks & Concurrency',
    difficulty: 'Advanced',
    question: 'Which of the following is NOT one of Coffman’s four necessary conditions for a Deadlock to occur?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctIndex: 2,
    explanation: 'The four Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly taken), 4. Circular Wait. "Preemption Allowed" actually prevents deadlocks.',
  },
  {
    id: 't-os2',
    subject: 'OS',
    topic: 'Virtual Memory & Paging',
    difficulty: 'Intermediate',
    question: 'What is "Thrashing" in an operating system?',
    options: [
      'A hardware error causing the CPU clock rate to drop.',
      'A condition where the CPU spends more time swapping pages in and out of memory than executing processes.',
      'A buffer overflow attack on the kernel stack.',
      'Defragmentation of the physical hard drive.',
    ],
    correctIndex: 1,
    explanation: 'Thrashing occurs when the total working set of active processes exceeds physical memory, causing continuous page faults and page swapping that halts real computational throughput.',
  },
  {
    id: 't-cn1',
    subject: 'CN',
    topic: 'TCP/IP & OSI Architecture',
    difficulty: 'Beginner',
    question: 'At which OSI layer does the Transport Layer Security (TLS/HTTPS) handshake typically operate?',
    options: ['Network Layer', 'Transport/Session Layer', 'Physical Layer', 'Data Link Layer'],
    correctIndex: 1,
    explanation: 'TLS resides between the Transport (TCP) and Application (HTTP) layers, commonly categorized across Transport/Session layers in the OSI reference model.',
  },
  {
    id: 't-oop1',
    subject: 'OOP',
    topic: 'Polymorphism & Design Principles',
    difficulty: 'Beginner',
    question: 'Method Overloading is an example of which type of polymorphism?',
    options: [
      'Compile-time (Static) Polymorphism',
      'Runtime (Dynamic) Polymorphism',
      'Coercion Polymorphism',
      'Virtual Dispatch',
    ],
    correctIndex: 0,
    explanation: 'Method Overloading is resolved at compile time based on parameter types and count (Static Polymorphism). Method Overriding with virtual methods is dynamic/runtime polymorphism.',
  },
];

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
  category: string;
  description: string;
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  sampleTestCases: {
    input: any;
    expected: any;
    explanation?: string;
  }[];
}

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    companyTags: ['Amazon', 'Google', 'TCS Digital', 'Microsoft'],
    category: 'Arrays & Hash Maps',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `function solution(input) {
  const { nums, target } = input;
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def solution(input_data):
    nums = input_data["nums"]
    target = input_data["target"]
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      cpp: `// C++ Placement Prototype
#include <vector>
#include <unordered_map>
std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int comp = target - nums[i];
        if (map.count(comp)) return {map[comp], i};
        map[nums[i]] = i;
    }
    return {};
}`,
      java: `// Java Placement Prototype
import java.util.HashMap;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) return new int[]{map.get(comp), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    },
    sampleTestCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expected: [0, 1],
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].',
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expected: [1, 2],
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, return [1, 2].',
      },
      {
        input: { nums: [3, 3], target: 6 },
        expected: [0, 1],
        explanation: 'nums[0] + nums[1] == 3 + 3 == 6, return [0, 1].',
      },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    companyTags: ['Infosys', 'Cognizant', 'Accenture', 'Amazon'],
    category: 'Stack',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      javascript: `function solution(input) {
  const s = input.s;
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def solution(input_data):
    s = input_data["s"]
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`,
      cpp: `// C++ Stack solution
#include <string>
#include <stack>
bool isValid(std::string s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}`,
      java: `// Java Stack solution
import java.util.Stack;
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
    },
    sampleTestCases: [
      { input: { s: '()' }, expected: true },
      { input: { s: '()[]{}' }, expected: true },
      { input: { s: '(]' }, expected: false },
    ],
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    companyTags: ['Microsoft', 'Amazon', 'Wipro Turbo', 'TCS Digital'],
    category: 'Dynamic Programming',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      javascript: `function solution(input) {
  const nums = input.nums;
  let maxSoFar = nums[0];
  let curr = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curr = Math.max(nums[i], curr + nums[i]);
    maxSoFar = Math.max(maxSoFar, curr);
  }
  return maxSoFar;
}`,
      python: `def solution(input_data):
    nums = input_data["nums"]
    max_so_far = curr = nums[0]
    for num in nums[1:]:
        curr = max(num, curr + num)
        max_so_far = max(max_so_far, curr)
    return max_so_far`,
      cpp: `// C++ Kadane
int maxSubArray(std::vector<int>& nums) {
    int maxS = nums[0], curr = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        curr = std::max(nums[i], curr + nums[i]);
        maxS = std::max(maxS, curr);
    }
    return maxS;
}`,
      java: `// Java Kadane
class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0], curr = nums[0];
        for (int i = 1; i < nums.length; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            max = Math.max(max, curr);
        }
        return max;
    }
}`,
    },
    sampleTestCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6, explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: { nums: [1] }, expected: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
    ],
  },
];

export interface InterviewTrack {
  id: string;
  title: string;
  category: 'HR' | 'Technical' | 'Company-Specific';
  targetCompany?: string;
  badge: string;
  questions: {
    question: string;
    tips: string;
    starGuidance: string;
  }[];
}

export const INTERVIEW_TRACKS: InterviewTrack[] = [
  {
    id: 'hr-foundational',
    title: 'HR & Behavioral STAR Round',
    category: 'HR',
    badge: 'Campus Standard',
    questions: [
      {
        question: 'Tell me about yourself, your academic background, and why you are interested in this role.',
        tips: 'Keep it within 90 seconds. Structure: Past (Degree/College) -> Present (Projects & Skills) -> Future (Company alignment).',
        starGuidance: 'Highlight tangible achievements and alignment with engineering culture.',
      },
      {
        question: 'Describe a challenging engineering or academic project where you faced a significant hurdle. How did you resolve it?',
        tips: 'Use the STAR method: Situation, Task, Action, Result. Focus 70% of your time on YOUR specific actions.',
        starGuidance: 'Detail the exact problem, the technical diagnosis, your initiative, and the quantifiable outcome.',
      },
      {
        question: 'Tell me about a time you had a conflict with a teammate during a group project. How did you navigate it?',
        tips: 'Show emotional intelligence, active listening, objectivity, and focus on the common project objective.',
        starGuidance: 'Emphasize professional resolution rather than assigning blame.',
      },
    ],
  },
  {
    id: 'tech-sde',
    title: 'Software Development Engineer (Core Tech)',
    category: 'Technical',
    badge: 'Tier-1 Product',
    questions: [
      {
        question: 'How does indexing work internally in a relational database, and what are the trade-offs of B-Trees vs Hash Indexes?',
        tips: 'Explain disk I/O reduction, range queries, write overhead on INSERT/UPDATE, and pointer traversing.',
        starGuidance: 'Provide real-world scenarios: when B-Trees shine (range scans) vs Hash Index (exact O(1) equality lookup).',
      },
      {
        question: 'Walk me through the lifecycle of a web request from the moment you hit Enter on a browser URL until the page renders.',
        tips: 'Cover DNS lookup, TCP 3-way handshake, TLS negotiation, HTTP GET request, server reverse proxy, and browser DOM rendering.',
        starGuidance: 'Demonstrate depth across OS, networking, and application layers.',
      },
    ],
  },
  {
    id: 'company-tcs-infy',
    title: 'Mass Recruiter Track (TCS / Infosys / Cognizant)',
    category: 'Company-Specific',
    targetCompany: 'TCS / Infosys',
    badge: 'Service Giant',
    questions: [
      {
        question: 'Explain the four core principles of Object-Oriented Programming with real-world examples from a project you built.',
        tips: 'Explain Encapsulation, Abstraction, Inheritance, and Polymorphism without textbook definitions only.',
        starGuidance: 'Ground your answer in a vehicle or bank account or e-commerce codebase.',
      },
      {
        question: 'Why do you want to join our organization, and are you comfortable working across different technology stacks and locations?',
        tips: 'Demonstrate adaptability, genuine interest in their enterprise scale, and proactive learning mindset.',
        starGuidance: 'Showcase curiosity and continuous willingness to upskill.',
      },
    ],
  },
  {
    id: 'company-faang',
    title: 'FAANG / Tier-1 Prep (Amazon / Google)',
    category: 'Company-Specific',
    targetCompany: 'Amazon / Google',
    badge: 'High CTC',
    questions: [
      {
        question: 'Amazon Leadership Principle: Tell me about a time you had to make a critical technical decision with incomplete information (Bias for Action).',
        tips: 'Demonstrate calculated risk taking, speed vs reversibility (two-way door decisions), and measuring post-launch metrics.',
        starGuidance: 'Specify how you gathered partial data, hypothesized, executed quickly, and adapted.',
      },
    ],
  },
];

export interface MockAssessment {
  id: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  category: string;
  companyTag: string;
  sections: {
    name: string;
    questionCount: number;
  }[];
}

export const MOCK_ASSESSMENTS: MockAssessment[] = [
  {
    id: 'tcs-nqt-full',
    title: 'TCS NQT Comprehensive Placement Mock',
    durationMinutes: 45,
    totalQuestions: 15,
    category: 'Full Mock Test',
    companyTag: 'TCS National Qualifier',
    sections: [
      { name: 'Quantitative Ability', questionCount: 5 },
      { name: 'Reasoning Ability', questionCount: 5 },
      { name: 'Technical Fundamentals', questionCount: 5 },
    ],
  },
  {
    id: 'product-oa-mock',
    title: 'Amazon & Tier-1 Product OA Simulation',
    durationMinutes: 60,
    totalQuestions: 18,
    category: 'Product Company Mock',
    companyTag: 'Amazon / Microsoft OA',
    sections: [
      { name: 'Advanced DSA & Logic', questionCount: 6 },
      { name: 'OS, DBMS & Networks', questionCount: 6 },
      { name: 'Quantitative & Analytical', questionCount: 6 },
    ],
  },
  {
    id: 'genc-assessment',
    title: 'Cognizant GenC / Accenture Assessment',
    durationMinutes: 30,
    totalQuestions: 12,
    category: 'Campus Assessment',
    companyTag: 'Cognizant / Accenture',
    sections: [
      { name: 'Verbal Ability & Grammar', questionCount: 4 },
      { name: 'Logical Reasoning & Series', questionCount: 4 },
      { name: 'Pseudocode & Programming', questionCount: 4 },
    ],
  },
];
