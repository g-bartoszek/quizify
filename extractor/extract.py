import sys
import pymupdf  # PyMuPDF
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()

client = OpenAI(organization="org-c0kigYrtAAhLNdilnkXa66rF",
                project="proj_m5GVH74nhIWA0ryjXH1t2YDz")

def ask_chat(prompt_text):

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": prompt_text
            }
        ]
    )

    return completion.choices[0].message.content

def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]


    try:
        document = pymupdf.open(pdf_path)
        toc = document.get_toc()

        questions = []

        for i in range(len(toc) - 1):
            _, title, start_page = toc[i]
            print(f"Title: {title}")
            _, _, end_page = toc[i + 1]
            chapter_text = ""

            for page_num in range(start_page - 1, end_page - 1):
                page_text = document.load_page(page_num).get_text()
                chapter_text += page_text + "\n"

            resp = get_questions(chapter_text)
            parsed = parse_questions(resp)

            questions.append(parsed)


        with open('questions.json', 'w') as f:
            json.dump(questions, f, indent=4)

    except Exception as e:
        print(f"Error: {e}")


def get_questions(chapter):
    response = ask_chat("""I'll give you a chapter of a technical book. Based on this chapter create a list of quiz questions
                        one can use to study the chapter. Each question should consist of a question and four possible answers.
                        Make the answers sound plausible so that the questions are not easy to answer.

                        Output the questions as a valid json in the follwoing format:
                        List of items where each item is:
                        question: text,
                        answers: list of 4 answers
                        correct: index of the correct answer
                        explanation: explanation on why the answer is correct based on the contents of the chapter

                        Ignore meanignleass chapters like table of contents or preface, return an empty list for them.
                        The questions should be about the discussed subject not about the exact content so don't ask about pages, chapters or authors.

                        Example of a good question:
                        "Which of the following components is typically NOT a standard building block for data-intensive applications?

                        Example of a bad question:
                        "Which aspect is primarily discussed in Chapter 2?"

                        Try to come up with 10 to 20 questions if possible.

                        Chapter text:
                        """ + chapter)

    print(response)
    return response

def parse_questions(json_input):
    import json
    try:
        questions_data = json_input.split('```json')[1].split('```')[0].strip()
        questions_list = json.loads(questions_data)
        return questions_list
    except (IndexError, json.JSONDecodeError) as e:
        print("Error parsing questions:", e)
        return []


if __name__ == "__main__":
    main()

