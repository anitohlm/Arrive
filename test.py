import os
from dotenv import load_dotenv

load_dotenv()

from agents.reflection_agent import get_daily_prompt
from agents.streak_agent import process_streak
from db import get_user, save_user, save_entry
from search import create_index_if_not_exists, index_entry, search_memories
from agents.memory_agent import resurface_memories
from agents.mindfulness_agent import get_exercise
from agents.insights_agent import generate_portrait
from agents.grace_agent import generate_grace_message
from agents.insight_agent import generate_post_insight
from orchestrator import handle_open_app, handle_submit_entry, handle_monthly_insights



def test_reflection():
    print("Testing Reflection Agent...")
    result = get_daily_prompt(mood="happy", intention="joy")
    print(f"📝 {result}")
    print("✅ Reflection Agent working!\n")

def test_streak():
    print("Testing Streak Agent...")
    result = process_streak("user123")
    print(f"✅ Streak: {result['streak']}")
    print(f"✅ Message: {result['message']}\n")

def test_search():
    print("Testing AI Search...")

    # Create index
    create_index_if_not_exists()

    # Index sample entries
    index_entry({
        "id": "entry001",
        "userId": "user123",
        "content": "I am grateful for my morning coffee and the sunshine",
        "mood": "happy",
        "dayNumber": 5,
        "timestamp": "2026-04-09"
    })
    index_entry({
        "id": "entry002",
        "userId": "user123",
        "content": "I am grateful for my sister who called me today",
        "mood": "happy",
        "dayNumber": 3,
        "timestamp": "2026-04-07"
    })
    index_entry({
        "id": "entry003",
        "userId": "user123",
        "content": "I am grateful for a quiet evening at home",
        "mood": "peaceful",
        "dayNumber": 1,
        "timestamp": "2026-04-05"
    })
    print("✅ Sample entries indexed!")

    # Wait for indexing
    import time
    time.sleep(3)

    # Search
    memories = search_memories("user123", "happy")
    print(f"✅ Found {len(memories)} memories:")
    for m in memories:
        print(f"   Day {m['day']}: {m['content']}")

    print("✅ AI Search working!\n")

def test_memory():
    print("Testing Memory Agent...")
    result = resurface_memories("user123", "happy")
    print(f"✅ Found {len(result['memories'])} memories")
    print(f"📝 Message: {result['message']}")
    print("✅ Memory Agent working!\n")

def test_mindfulness():
    print("Testing Mindfulness Agent...")

    # Test stressed mood
    result = get_exercise("stressed")
    print(f"📝 Exercise for stressed:\n{result}\n")

    print("✅ Mindfulness Agent working!\n")

def test_insights():
    print("Testing Insights Agent...")
    result = generate_portrait("user123")
    print(f"📝 Gratitude Portrait:\n{result}")
    print("\n✅ Insights Agent working!\n")

def test_orchestrator():
    print("Testing Orchestrator...\n")

    # Test 1 — open app happy
    print("Test 1 — Open app (happy mood):")
    result = handle_open_app(
        user_id="user123",
        mood="happy",
        intention="joy",
        hours_absent=1
    )
    print(f"📝 Prompt: {result['prompt']}")
    print()

    # Test 2 — open app stressed
    print("Test 2 — Open app (stressed + absent 20hrs):")
    result = handle_open_app(
        user_id="user123",
        mood="stressed",
        intention="peace",
        hours_absent=20
    )
    print(f"📝 Prompt: {result['prompt']}")
    print(f"💭 Memories: {result.get('memories', {}).get('message', 'none')}")
    print(f"🧘 Exercise: {result.get('exercise', 'none')[:80]}...")
    print()

    # Test 3 — submit entry
    print("Test 3 — Submit entry:")
    result = handle_submit_entry(
        user_id="user456",
        content="I am grateful for this hackathon journey!",
        mood="happy",
        intention="joy"
    )
    print(f"✅ Streak: {result.get('streak')}")
    print(f"✅ Milestone: {result.get('milestone')}")
    print(f"✅ Message: {result.get('message')}")
    print()

    # Test 4 — monthly insights
    print("Test 4 — Monthly insights:")
    result = handle_monthly_insights("user123")
    print(f"📊 Portrait:\n{result['portrait']}")

    print("\n✅ Orchestrator working!")

def test_post_insight():
    print("Testing Post-Insight Agent...")

    # Test with a calm entry
    result = generate_post_insight(
        content="The coffee was warm and I just sat with it. I didn't check my phone. That was enough.",
        mood="calm",
        day_number=8
    )
    print(f"📝 Calm insight:\n{result}\n")

    # Test with a hard entry
    result = generate_post_insight(
        content="Everything felt heavy today but I noticed the light through the window.",
        mood="hard",
        day_number=15
    )
    print(f"📝 Hard insight:\n{result}\n")

    print("✅ Post-Insight Agent working!\n")

def test_grace_agent():
    print("Testing Grace Agent...")

    # Test 1 — missed 1 day, light emotion
    print("Test 1 — Missed 1 day (was grateful):")
    result = generate_grace_message(
        days_missed=1,
        streak_before=7,
        last_emotion="grateful",
        days_away=1
    )
    print(f"💌 {result}\n")

    # Test 2 — missed 3 days, heavy emotion
    print("Test 2 — Missed 3 days (was exhausted):")
    result = generate_grace_message(
        days_missed=3,
        streak_before=30,
        last_emotion="exhausted",
        days_away=3
    )
    print(f"💌 {result}\n")

    # Test 3 — missed 10 days, long absence
    print("Test 3 — Missed 10 days (was sad):")
    result = generate_grace_message(
        days_missed=10,
        streak_before=45,
        last_emotion="sad",
        days_away=10
    )
    print(f"💌 {result}\n")

    print("✅ Grace Agent working!\n")

if __name__ == "__main__":
    test_orchestrator()
    test_reflection()
    test_streak()
    test_search()
    test_memory()
    test_mindfulness()
    test_insights()