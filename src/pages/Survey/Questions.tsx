import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Container, Progress, Button, Text, Card, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import api from '../../api/api';
import { AuthenticationContext } from '../../contexts/Authentication';
import { PageHeader } from '../../components/PageHeader';
import { Link } from 'react-router-dom';
import { PrimaryIconButton } from '../../components/IconButton';
import { IconChevronLeft } from '@tabler/icons-react';

const choices = [
    { label: 'Strongly Disagree', value: 1 },
    { label: 'Disagree', value: 2 },
    { label: 'Agree', value: 3 },
    { label: 'Strongly Agree', value: 4 },
];

enum SurveyStatus {
    START = 'survey-start',
    IN_PROGRESS = 'survey-in-progress',
    COMPLETED = 'survey-complete',
}

type SurveyComponentProps = {
    changeStateFunction: (status: SurveyStatus) => void;
    status: SurveyStatus;
};

type SurveyResponses = {
    [questionId: string]: number;
};

type SurveyQuestion = {
    indexQuestion: string; // Added indexQuestion to the type
    question: string; // Renamed question to match your data structure
};


type ApiResponse = {
    response: {
        questions: SurveyQuestion[];
    };
    status: number;
    message: string;
    name: string;
};



interface Answer {
    indexQuestion: string;
    answer: number;
}

interface Answers {
    answers: Answer[];
}

interface ResponseMessage {
    message: string;
}



const SurveyComponent = ({ changeStateFunction, status }: SurveyComponentProps) => {
    const authContext = useContext(AuthenticationContext);
    const { user } = authContext;
    const currentUser = user?.email as string
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [responses, setResponses] = useState<SurveyResponses>({});
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);

    const [carousel, setCarousel] = useState(null)




    const generateQuestions = async (email: string, company: string) => {
        try {
            const params = { email, company };
            const response = await api.get<ApiResponse>('/api/engine/generateQuestions', { params });
            console.log(response.data)
            if (response.data.message) {

            }
            // setSurveyQuestions(response.data.response.questions)
            // console.log(response.data.response.questions)
            return response.data/*.response.questions*/
        } catch (error) {
            console.error('Error generating questions:', error);
            throw error;
        }
    };

    const submitAnswers = async (email: string, payload: Answers): Promise<ResponseMessage | undefined> => {
        try {
            const response = await api.post('/api/engine/submitAnswers', payload, {
                params: {
                    email: email
                }
            });
            if (response.status === 200) {
                return response.data as ResponseMessage;
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questions = await generateQuestions(currentUser, 'Sample Company');
                console.log(questions)
                if (questions) {
                    setSurveyQuestions(questions);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (surveyQuestions.length > 0) {
            const progress = ((currentSlide + 1) / surveyQuestions.length) * 100;
            setProgressValue(progress);
            setSelectedChoice(responses[surveyQuestions[currentSlide]?.indexQuestion] || null);
        }
    }, [currentSlide, responses, surveyQuestions]);

    const handleChoiceClicked = (value: number) => {
        setResponses((prev) => ({
            ...prev,
            [surveyQuestions[currentSlide].indexQuestion]: value,
        }));
        setSelectedChoice(value);
        if (carousel) carousel.scrollNext(); // Access Embla API to scroll
    };

    const handleSubmit = async () => {
        const data: Answers = {
            answers: Object.keys(responses).map((questionId) => {
                // Format the index as needed. Assuming questionId is already in the correct format.
                const formattedIndex = questionId.replace('_', '_'); // You can adjust this if necessary

                return {
                    indexQuestion: formattedIndex,
                    answer: responses[questionId],
                };
            }),
        };

        console.log(data);

        // Email parameter
        const emailS = user?.email;
        console.log(emailS)
        try {
            await submitAnswers(currentUser, data).then((response) => console.log(response))
        } catch (error) {
            console.error(error);
        }

        // Changing the state once the survey is completed
        changeStateFunction(SurveyStatus.COMPLETED);
    };

    return (
        <Box style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}>
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 50,
                    height: '100%',
                }}
            >
                <PageHeader
                    style={{ paddingTop: 24, paddingBottom: 32 }}
                    actionButton={
                        <Link to="/">
                            <PrimaryIconButton>
                                <IconChevronLeft />
                            </PrimaryIconButton>
                        </Link>
                    }
                />
                <Text style={{ fontSize: '32px', marginBottom: '32px' }}>Questions</Text>
                <Box style={{ marginBottom: 32 }}>
                    <Progress value={progressValue} />
                </Box>

                {surveyQuestions.length > 0 ? (
                    <Carousel
                        getEmblaApi={setCarousel}
                        // Attach the ref here
                        withControls={false}
                        onSlideChange={(index) => setCurrentSlide(index)}
                        slideGap={32}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            '& .mantineCarouselViewport': { height: '100%' },
                            '& .mantineCarouselContainer': { height: '100%' },
                        }}
                    >
                        {surveyQuestions.map((question, index) => (
                            <Carousel.Slide key={question.indexQuestion}> {/* Use indexQuestion as key */}
                                <Card
                                    shadow="md"
                                    radius="lg"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        padding: 32,
                                    }}
                                >
                                    <Text size="xl" mb="md">
                                        {question.question}
                                    </Text>
                                    <Group style={{ marginTop: 24 }}>
                                        {choices.map((choice) => (
                                            <Button
                                                key={`${choice.value}-${question.indexQuestion}`}
                                                variant={selectedChoice === choice.value ? 'filled' : 'outline'}
                                                color={selectedChoice === choice.value ? '#6E51FF' : 'gray'}
                                                onClick={() => handleChoiceClicked(choice.value)}
                                            >
                                                {choice.label}
                                            </Button>
                                        ))}
                                    </Group>
                                    {index === surveyQuestions.length - 1 && (
                                        <Button
                                            style={{ marginTop: 32 }}
                                            onClick={handleSubmit}
                                            disabled={!selectedChoice}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Card>
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                ) : (
                    <Text>There are no questions available!</Text>
                )}

            </Container>

            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: '50%',
                    background: 'rgba(0, 0, 0, 0.1)',
                    opacity: 0.5,
                }}
            />
        </Box>
    );
};

export default SurveyComponent;