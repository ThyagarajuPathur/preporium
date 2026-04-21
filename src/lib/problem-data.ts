import type { Difficulty, Problem, ProblemDay } from "@/lib/types";

const PATH_NAME = "senior-30-day";

const problem = (
  order: number,
  leetcodeNumber: number,
  title: string,
  difficulty: Difficulty,
  pattern: string,
  slug: string,
): Omit<Problem, "dayNumber" | "dayOrder" | "focus" | "id" | "pathName" | "topic" | "url"> & {
  order: number;
} => ({
  order,
  title,
  leetcodeNumber,
  slug,
  difficulty,
  pattern,
});

const day = (
  dayNumber: number,
  topic: string,
  focus: string,
  problems: Array<
    Omit<Problem, "dayNumber" | "dayOrder" | "focus" | "id" | "pathName" | "topic" | "url"> & {
      order: number;
    }
  >,
): ProblemDay => ({
  dayNumber,
  topic,
  focus,
  problems: problems.map((item) => ({
    id: item.slug,
    dayNumber,
    dayOrder: item.order,
    topic,
    focus,
    title: item.title,
    leetcodeNumber: item.leetcodeNumber,
    slug: item.slug,
    url: `https://leetcode.com/problems/${item.slug}/`,
    difficulty: item.difficulty,
    pattern: item.pattern,
    pathName: PATH_NAME,
  })),
});

export const problemDays: ProblemDay[] = [
  day(1, "Arrays & Hashing Foundations", "Core lookups, counting, and canonical array patterns.", [
    problem(1, 1, "Two Sum", "Easy", "Hash map", "two-sum"),
    problem(2, 217, "Contains Duplicate", "Easy", "Set / hash map", "contains-duplicate"),
    problem(3, 242, "Valid Anagram", "Easy", "Counting", "valid-anagram"),
    problem(4, 49, "Group Anagrams", "Medium", "Hashing + signatures", "group-anagrams"),
    problem(5, 347, "Top K Frequent Elements", "Medium", "Bucket sort / heap", "top-k-frequent-elements"),
  ]),
  day(2, "Prefix Sums & Kadane", "Build intuition for cumulative state and one-pass optimization.", [
    problem(1, 121, "Best Time to Buy and Sell Stock", "Easy", "Running minimum", "best-time-to-buy-and-sell-stock"),
    problem(2, 53, "Maximum Subarray", "Medium", "Kadane's algorithm", "maximum-subarray"),
    problem(3, 238, "Product of Array Except Self", "Medium", "Prefix / suffix", "product-of-array-except-self"),
    problem(4, 560, "Subarray Sum Equals K", "Medium", "Prefix sum + hash map", "subarray-sum-equals-k"),
    problem(5, 303, "Range Sum Query - Immutable", "Easy", "Prefix sums", "range-sum-query-immutable"),
  ]),
  day(3, "Sliding Window Basics", "Learn fixed and variable windows before tougher string problems.", [
    problem(1, 3, "Longest Substring Without Repeating Characters", "Medium", "Variable sliding window", "longest-substring-without-repeating-characters"),
    problem(2, 424, "Longest Repeating Character Replacement", "Medium", "Window + frequency", "longest-repeating-character-replacement"),
    problem(3, 567, "Permutation in String", "Medium", "Fixed window + counts", "permutation-in-string"),
    problem(4, 209, "Minimum Size Subarray Sum", "Medium", "Variable sliding window", "minimum-size-subarray-sum"),
    problem(5, 643, "Maximum Average Subarray I", "Easy", "Fixed sliding window", "maximum-average-subarray-i"),
  ]),
  day(4, "Two Pointers", "Use pointer movement logic for sorted arrays and greedy scanning.", [
    problem(1, 125, "Valid Palindrome", "Easy", "Two pointers", "valid-palindrome"),
    problem(2, 167, "Two Sum II - Input Array Is Sorted", "Medium", "Two pointers", "two-sum-ii-input-array-is-sorted"),
    problem(3, 15, "3Sum", "Medium", "Sorting + two pointers", "3sum"),
    problem(4, 11, "Container With Most Water", "Medium", "Greedy two pointers", "container-with-most-water"),
    problem(5, 42, "Trapping Rain Water", "Hard", "Two pointers", "trapping-rain-water"),
  ]),
  day(5, "Matrix & Simulation", "Practice state transitions, in-place updates, and grid traversal.", [
    problem(1, 36, "Valid Sudoku", "Medium", "Matrix validation", "valid-sudoku"),
    problem(2, 73, "Set Matrix Zeroes", "Medium", "In-place markers", "set-matrix-zeroes"),
    problem(3, 48, "Rotate Image", "Medium", "Matrix transform", "rotate-image"),
    problem(4, 54, "Spiral Matrix", "Medium", "Boundary simulation", "spiral-matrix"),
    problem(5, 79, "Word Search", "Medium", "Grid DFS", "word-search"),
  ]),
  day(6, "Stacks", "Master push/pop invariants before monotonic structures.", [
    problem(1, 20, "Valid Parentheses", "Easy", "Stack", "valid-parentheses"),
    problem(2, 155, "Min Stack", "Medium", "Stack design", "min-stack"),
    problem(3, 739, "Daily Temperatures", "Medium", "Monotonic stack", "daily-temperatures"),
    problem(4, 150, "Evaluate Reverse Polish Notation", "Medium", "Stack evaluation", "evaluate-reverse-polish-notation"),
    problem(5, 853, "Car Fleet", "Medium", "Sorting + stack thinking", "car-fleet"),
  ]),
  day(7, "Intervals & Monotonic Thinking", "Blend sorting-based interval logic with harder stack reasoning.", [
    problem(1, 56, "Merge Intervals", "Medium", "Intervals", "merge-intervals"),
    problem(2, 57, "Insert Interval", "Medium", "Intervals", "insert-interval"),
    problem(3, 435, "Non-overlapping Intervals", "Medium", "Greedy intervals", "non-overlapping-intervals"),
    problem(4, 84, "Largest Rectangle in Histogram", "Hard", "Monotonic stack", "largest-rectangle-in-histogram"),
    problem(5, 402, "Remove K Digits", "Medium", "Greedy monotonic stack", "remove-k-digits"),
  ]),
  day(8, "Linked Lists I", "Get pointer manipulation comfortable before cache/design problems.", [
    problem(1, 206, "Reverse Linked List", "Easy", "Pointer reversal", "reverse-linked-list"),
    problem(2, 21, "Merge Two Sorted Lists", "Easy", "Pointer merge", "merge-two-sorted-lists"),
    problem(3, 141, "Linked List Cycle", "Easy", "Fast / slow pointers", "linked-list-cycle"),
    problem(4, 19, "Remove Nth Node From End of List", "Medium", "Two pointers", "remove-nth-node-from-end-of-list"),
    problem(5, 143, "Reorder List", "Medium", "Split + reverse + merge", "reorder-list"),
  ]),
  day(9, "Linked Lists II & Design", "Move from mechanics to composed linked-list interview patterns.", [
    problem(1, 2, "Add Two Numbers", "Medium", "Linked list simulation", "add-two-numbers"),
    problem(2, 138, "Copy List with Random Pointer", "Medium", "Hash map / weaving", "copy-list-with-random-pointer"),
    problem(3, 146, "LRU Cache", "Medium", "Hash map + doubly linked list", "lru-cache"),
    problem(4, 25, "Reverse Nodes in k-Group", "Hard", "Segment reversal", "reverse-nodes-in-k-group"),
    problem(5, 23, "Merge k Sorted Lists", "Hard", "Heap / divide and conquer", "merge-k-sorted-lists"),
  ]),
  day(10, "Trees DFS", "Start with recursive tree patterns and structural reasoning.", [
    problem(1, 104, "Maximum Depth of Binary Tree", "Easy", "Tree DFS", "maximum-depth-of-binary-tree"),
    problem(2, 100, "Same Tree", "Easy", "Tree recursion", "same-tree"),
    problem(3, 226, "Invert Binary Tree", "Easy", "Tree recursion", "invert-binary-tree"),
    problem(4, 543, "Diameter of Binary Tree", "Easy", "Postorder DFS", "diameter-of-binary-tree"),
    problem(5, 110, "Balanced Binary Tree", "Easy", "Bottom-up DFS", "balanced-binary-tree"),
  ]),
  day(11, "Trees BFS & Construction", "Add queue-based traversal and reconstruction from traversal orders.", [
    problem(1, 102, "Binary Tree Level Order Traversal", "Medium", "BFS", "binary-tree-level-order-traversal"),
    problem(2, 199, "Binary Tree Right Side View", "Medium", "BFS / DFS", "binary-tree-right-side-view"),
    problem(3, 236, "Lowest Common Ancestor of a Binary Tree", "Medium", "Tree recursion", "lowest-common-ancestor-of-a-binary-tree"),
    problem(4, 105, "Construct Binary Tree from Preorder and Inorder Traversal", "Medium", "Divide and conquer", "construct-binary-tree-from-preorder-and-inorder-traversal"),
    problem(5, 98, "Validate Binary Search Tree", "Medium", "Bounds / inorder", "validate-binary-search-tree"),
  ]),
  day(12, "BSTs & Heaps", "Practice ordered trees and top-k / streaming patterns.", [
    problem(1, 230, "Kth Smallest Element in a BST", "Medium", "Inorder traversal", "kth-smallest-element-in-a-bst"),
    problem(2, 124, "Binary Tree Maximum Path Sum", "Hard", "Tree DP", "binary-tree-maximum-path-sum"),
    problem(3, 973, "K Closest Points to Origin", "Medium", "Heap", "k-closest-points-to-origin"),
    problem(4, 215, "Kth Largest Element in an Array", "Medium", "Heap / quickselect", "kth-largest-element-in-an-array"),
    problem(5, 295, "Find Median from Data Stream", "Hard", "Two heaps", "find-median-from-data-stream"),
  ]),
  day(13, "Graphs I", "Cover DFS/BFS on implicit grids and explicit adjacency lists.", [
    problem(1, 200, "Number of Islands", "Medium", "Grid DFS / BFS", "number-of-islands"),
    problem(2, 133, "Clone Graph", "Medium", "Graph traversal", "clone-graph"),
    problem(3, 695, "Max Area of Island", "Medium", "Grid DFS", "max-area-of-island"),
    problem(4, 417, "Pacific Atlantic Water Flow", "Medium", "Reverse graph thinking", "pacific-atlantic-water-flow"),
    problem(5, 130, "Surrounded Regions", "Medium", "Boundary DFS / BFS", "surrounded-regions"),
  ]),
  day(14, "Graphs II", "Add DAGs, graph coloring, and cycle detection.", [
    problem(1, 207, "Course Schedule", "Medium", "Topological sort / cycle detect", "course-schedule"),
    problem(2, 210, "Course Schedule II", "Medium", "Topological ordering", "course-schedule-ii"),
    problem(3, 684, "Redundant Connection", "Medium", "Union find", "redundant-connection"),
    problem(4, 785, "Is Graph Bipartite?", "Medium", "Graph coloring", "is-graph-bipartite"),
    problem(5, 886, "Possible Bipartition", "Medium", "Graph coloring", "possible-bipartition"),
  ]),
  day(15, "Union Find & Shortest Paths", "Build comfort with disjoint sets, weighted grids, and multi-source BFS.", [
    problem(1, 721, "Accounts Merge", "Medium", "Union find", "accounts-merge"),
    problem(2, 547, "Number of Provinces", "Medium", "Union find / DFS", "number-of-provinces"),
    problem(3, 1631, "Path With Minimum Effort", "Medium", "Dijkstra / binary search", "path-with-minimum-effort"),
    problem(4, 743, "Network Delay Time", "Medium", "Dijkstra", "network-delay-time"),
    problem(5, 994, "Rotting Oranges", "Medium", "Multi-source BFS", "rotting-oranges"),
  ]),
  day(16, "Binary Search Basics", "Practice exact-match, boundary, and rotated-array templates.", [
    problem(1, 704, "Binary Search", "Easy", "Binary search", "binary-search"),
    problem(2, 35, "Search Insert Position", "Easy", "Lower bound", "search-insert-position"),
    problem(3, 74, "Search a 2D Matrix", "Medium", "Flattened binary search", "search-a-2d-matrix"),
    problem(4, 153, "Find Minimum in Rotated Sorted Array", "Medium", "Binary search on pivot", "find-minimum-in-rotated-sorted-array"),
    problem(5, 33, "Search in Rotated Sorted Array", "Medium", "Rotated binary search", "search-in-rotated-sorted-array"),
  ]),
  day(17, "Binary Search on Answer", "Use feasibility checks and monotonic functions.", [
    problem(1, 875, "Koko Eating Bananas", "Medium", "Binary search on answer", "koko-eating-bananas"),
    problem(2, 1011, "Capacity To Ship Packages Within D Days", "Medium", "Binary search on answer", "capacity-to-ship-packages-within-d-days"),
    problem(3, 410, "Split Array Largest Sum", "Hard", "Binary search on answer", "split-array-largest-sum"),
    problem(4, 981, "Time Based Key-Value Store", "Medium", "Binary search over timestamps", "time-based-key-value-store"),
    problem(5, 162, "Find Peak Element", "Medium", "Binary search on shape", "find-peak-element"),
  ]),
  day(18, "Greedy", "Strengthen local-choice reasoning and exchange arguments.", [
    problem(1, 55, "Jump Game", "Medium", "Greedy reachability", "jump-game"),
    problem(2, 45, "Jump Game II", "Medium", "Greedy layers", "jump-game-ii"),
    problem(3, 134, "Gas Station", "Medium", "Greedy reset", "gas-station"),
    problem(4, 846, "Hand of Straights", "Medium", "Greedy + counting", "hand-of-straights"),
    problem(5, 763, "Partition Labels", "Medium", "Greedy intervals", "partition-labels"),
  ]),
  day(19, "Backtracking I", "Generate combinations/permutations before the higher-branching cases.", [
    problem(1, 78, "Subsets", "Medium", "Backtracking", "subsets"),
    problem(2, 39, "Combination Sum", "Medium", "Backtracking", "combination-sum"),
    problem(3, 46, "Permutations", "Medium", "Backtracking", "permutations"),
    problem(4, 17, "Letter Combinations of a Phone Number", "Medium", "Backtracking", "letter-combinations-of-a-phone-number"),
    problem(5, 131, "Palindrome Partitioning", "Medium", "Backtracking + pruning", "palindrome-partitioning"),
  ]),
  day(20, "Backtracking II", "Handle duplicates, constraints, and more expensive search trees.", [
    problem(1, 40, "Combination Sum II", "Medium", "Backtracking + dedupe", "combination-sum-ii"),
    problem(2, 90, "Subsets II", "Medium", "Backtracking + dedupe", "subsets-ii"),
    problem(3, 212, "Word Search II", "Hard", "Trie + backtracking", "word-search-ii"),
    problem(4, 51, "N-Queens", "Hard", "Constraint backtracking", "n-queens"),
    problem(5, 93, "Restore IP Addresses", "Medium", "Backtracking", "restore-ip-addresses"),
  ]),
  day(21, "1D Dynamic Programming", "Start with compact states and transition design.", [
    problem(1, 70, "Climbing Stairs", "Easy", "1D DP", "climbing-stairs"),
    problem(2, 198, "House Robber", "Medium", "1D DP", "house-robber"),
    problem(3, 213, "House Robber II", "Medium", "1D DP on circle", "house-robber-ii"),
    problem(4, 322, "Coin Change", "Medium", "Minimization DP", "coin-change"),
    problem(5, 91, "Decode Ways", "Medium", "State transitions", "decode-ways"),
  ]),
  day(22, "2D & Grid Dynamic Programming", "Expand to table DP, path problems, and edit-style transitions.", [
    problem(1, 62, "Unique Paths", "Medium", "Grid DP", "unique-paths"),
    problem(2, 64, "Minimum Path Sum", "Medium", "Grid DP", "minimum-path-sum"),
    problem(3, 120, "Triangle", "Medium", "Bottom-up DP", "triangle"),
    problem(4, 1143, "Longest Common Subsequence", "Medium", "2D DP", "longest-common-subsequence"),
    problem(5, 72, "Edit Distance", "Medium", "2D DP", "edit-distance"),
  ]),
  day(23, "Subsequence & Knapsack DP", "Work through subset-state reasoning and classic interview DP.", [
    problem(1, 416, "Partition Equal Subset Sum", "Medium", "0/1 knapsack", "partition-equal-subset-sum"),
    problem(2, 494, "Target Sum", "Medium", "Subset transformation", "target-sum"),
    problem(3, 300, "Longest Increasing Subsequence", "Medium", "DP / binary search", "longest-increasing-subsequence"),
    problem(4, 152, "Maximum Product Subarray", "Medium", "State tracking", "maximum-product-subarray"),
    problem(5, 139, "Word Break", "Medium", "String DP", "word-break"),
  ]),
  day(24, "Scheduling & Interval Applications", "Apply heaps, sweeps, and line-based reasoning to operations problems.", [
    problem(1, 621, "Task Scheduler", "Medium", "Greedy counting", "task-scheduler"),
    problem(2, 452, "Minimum Number of Arrows to Burst Balloons", "Medium", "Greedy intervals", "minimum-number-of-arrows-to-burst-balloons"),
    problem(3, 1094, "Car Pooling", "Medium", "Sweep line / prefix diff", "car-pooling"),
    problem(4, 729, "My Calendar I", "Medium", "Intervals / BST", "my-calendar-i"),
    problem(5, 2406, "Divide Intervals Into Minimum Number of Groups", "Medium", "Sweep line / heap", "divide-intervals-into-minimum-number-of-groups"),
  ]),
  day(25, "Trie & String Design", "Practice prefix-aware data structures and design-heavy APIs.", [
    problem(1, 208, "Implement Trie (Prefix Tree)", "Medium", "Trie", "implement-trie-prefix-tree"),
    problem(2, 211, "Design Add and Search Words Data Structure", "Medium", "Trie + DFS", "design-add-and-search-words-data-structure"),
    problem(3, 677, "Map Sum Pairs", "Medium", "Trie / hash map", "map-sum-pairs"),
    problem(4, 648, "Replace Words", "Medium", "Trie", "replace-words"),
    problem(5, 642, "Design Search Autocomplete System", "Hard", "Trie design", "design-search-autocomplete-system"),
  ]),
  day(26, "Bit Manipulation & Math", "Sharpen low-level thinking and binary representation tricks.", [
    problem(1, 136, "Single Number", "Easy", "XOR", "single-number"),
    problem(2, 191, "Number of 1 Bits", "Easy", "Bit counting", "number-of-1-bits"),
    problem(3, 338, "Counting Bits", "Easy", "DP on bits", "counting-bits"),
    problem(4, 190, "Reverse Bits", "Easy", "Bit manipulation", "reverse-bits"),
    problem(5, 371, "Sum of Two Integers", "Medium", "Bitwise addition", "sum-of-two-integers"),
  ]),
  day(27, "Advanced Graphs", "Tackle weighted graphs, MSTs, and graph ordering under constraints.", [
    problem(1, 787, "Cheapest Flights Within K Stops", "Medium", "Bellman-Ford / BFS layering", "cheapest-flights-within-k-stops"),
    problem(2, 332, "Reconstruct Itinerary", "Hard", "Eulerian path", "reconstruct-itinerary"),
    problem(3, 1584, "Min Cost to Connect All Points", "Medium", "MST", "min-cost-to-connect-all-points"),
    problem(4, 778, "Swim in Rising Water", "Hard", "Dijkstra / union find", "swim-in-rising-water"),
    problem(5, 269, "Alien Dictionary", "Hard", "Topological sort", "alien-dictionary"),
  ]),
  day(28, "Tree DP & Serialization", "Push tree recursion into stateful and interview-grade variants.", [
    problem(1, 297, "Serialize and Deserialize Binary Tree", "Hard", "Tree serialization", "serialize-and-deserialize-binary-tree"),
    problem(2, 968, "Binary Tree Cameras", "Hard", "Greedy tree DP", "binary-tree-cameras"),
    problem(3, 337, "House Robber III", "Medium", "Tree DP", "house-robber-iii"),
    problem(4, 437, "Path Sum III", "Medium", "Prefix sum on trees", "path-sum-iii"),
    problem(5, 1448, "Count Good Nodes in Binary Tree", "Medium", "DFS with state", "count-good-nodes-in-binary-tree"),
  ]),
  day(29, "Advanced Data Structures & Design", "Finish core prep with mutable ranges and system-style design questions.", [
    problem(1, 307, "Range Sum Query - Mutable", "Medium", "Fenwick tree / segment tree", "range-sum-query-mutable"),
    problem(2, 731, "My Calendar II", "Medium", "Line sweep / interval overlap", "my-calendar-ii"),
    problem(3, 432, "All O`one Data Structure", "Hard", "Linked list + hash map", "all-oone-data-structure"),
    problem(4, 460, "LFU Cache", "Hard", "Hash map + frequency buckets", "lfu-cache"),
    problem(5, 355, "Design Twitter", "Medium", "Heap + design", "design-twitter"),
  ]),
  day(30, "Senior-Level Mixed Review", "End with high-signal mixed problems that pressure multiple skills together.", [
    problem(1, 41, "First Missing Positive", "Hard", "Index placement", "first-missing-positive"),
    problem(2, 239, "Sliding Window Maximum", "Hard", "Monotonic deque", "sliding-window-maximum"),
    problem(3, 10, "Regular Expression Matching", "Hard", "2D DP", "regular-expression-matching"),
    problem(4, 312, "Burst Balloons", "Hard", "Interval DP", "burst-balloons"),
    problem(5, 127, "Word Ladder", "Hard", "BFS", "word-ladder"),
  ]),
];

export const allProblems = problemDays.flatMap((entry) => entry.problems);
