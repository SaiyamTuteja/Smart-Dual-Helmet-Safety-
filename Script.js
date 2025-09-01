        document.addEventListener('DOMContentLoaded', function () {
            
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.addEventListener('click', () => {
                    card.classList.toggle('flipped');
                });
            });

            const flowchartNodes = document.querySelectorAll('.flowchart-node');
            const flowchartText = document.getElementById('flowchart-text');
            const defaultFlowchartText = flowchartText.textContent;
            flowchartNodes.forEach(node => {
                node.addEventListener('mouseenter', () => {
                    flowchartText.textContent = node.getAttribute('data-info');
                });
                node.addEventListener('mouseleave', () => {
                     flowchartText.textContent = defaultFlowchartText;
                });
            });
            
            const componentData = {
                rider: {
                    title: "Rider Helmet Components",
                    items: [
                        "ESP32/Arduino Nano (Microcontroller)",
                        "MPU6050 (Accelerometer + Gyroscope)",
                        "MQ-3 Alcohol Sensor",
                        "MQ-2 Smoke Sensor",
                        "Strap Sensor for Compliance",
                        "GPS Module for Location Tracking",
                        "GSM Module for SMS Alerts",
                        "RF Transmitter to Vehicle Unit",
                        "Buzzer & LED for Alerts",
                        "Rechargeable 9V Battery"
                    ]
                },
                pillion: {
                    title: "Pillion Helmet Components",
                    items: [
                        "Mini Microcontroller",
                        "Strap Sensor for Compliance",
                        "RF Transmitter to Vehicle Unit",
                        "Rechargeable 9V Battery"
                    ]
                },
                vehicle: {
                    title: "Vehicle Unit Components",
                    items: [
                        "RF Receiver",
                        "Logic Gate Module (AND Verification)",
                        "Ignition Lock Control Module",
                        "Connection to Vehicle's Power"
                    ]
                }
            };
            
            const componentCards = document.querySelectorAll('.component-card');
            const detailsContainer = document.getElementById('component-details');
            const detailsTitle = document.getElementById('component-title');
            const detailsList = document.getElementById('component-list');
            
            componentCards.forEach(card => {
                card.addEventListener('click', () => {
                    const componentKey = card.getAttribute('data-component');
                    const data = componentData[componentKey];
                    
                    detailsTitle.textContent = data.title;
                    detailsList.innerHTML = '';
                    data.items.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        detailsList.appendChild(li);
                    });
                    
                    detailsContainer.classList.remove('hidden');
                });
            });
            
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    const tab = button.getAttribute('data-tab');
                    tabPanes.forEach(pane => {
                        if (pane.id === `${tab}-content`) {
                            pane.classList.remove('hidden');
                        } else {
                            pane.classList.add('hidden');
                        }
                    });
                });
            });

            const ctx = document.getElementById('impactChart').getContext('2d');
            const impactChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Helmet Non-Compliance', 'Drunk Driving Incidents', 'Accident Fatalities', 'Emergency Response Time'],
                    datasets: [{
                        label: 'Potential Reduction',
                        data: [85, 90, 40, 50],
                        backgroundColor: 'rgba(59, 130, 246, 0.7)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '%'
                                }
                            },
                             title: {
                                display: true,
                                text: 'Potential Improvement'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` Potential reduction: ${context.raw}%`;
                                }
                            },
                             font: {
                                 size: 14
                             }
                        },
                        title: {
                            display: true,
                            text: 'Estimated Positive Impact of System Adoption'
                        }
                    }
                }
            });
            
            const navLinks = document.querySelectorAll('header a');
            navLinks.forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if(targetElement){
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });

            const promptBox = document.getElementById('prompt-box');
            const askButton = document.getElementById('ask-button');
            const responseBox = document.getElementById('response-box');
            const responseText = document.getElementById('response-text');

            askButton.addEventListener('click', async () => {
                const userPrompt = promptBox.value.trim();
                if (!userPrompt) return;

                askButton.disabled = true;
                responseText.innerHTML = 'Thinking...';
                responseBox.classList.remove('hidden');

                const systemPrompt = "Act as a technical expert on the Smart Dual-Helmet Safety System described in the provided document. Provide concise, accurate answers and creative suggestions based on the document's content and your broader knowledge. Be helpful and informative.";
                // Base64 encoded API key for obfuscation
                const encodedApiKey = "QUl6YVN5QVdmc2hqdVVZUHI4aG93YzM1ZGxWR1RnOE81UDFSbEhv";
                function decodeBase64(str) {
                    return decodeURIComponent(atob(str).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                }
                const apiKey = decodeBase64(encodedApiKey);
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                const payload = {
                    contents: [{ parts: [{ text: userPrompt }] }],
                    tools: [{ "google_search": {} }],
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                };

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const result = await response.json();
                    const candidate = result.candidates?.[0];

                    if (candidate && candidate.content?.parts?.[0]?.text) {
                        const text = candidate.content.parts[0].text;
                        responseText.innerHTML = text.replace(/\n/g, '<br>');
                    } else {
                        responseText.textContent = 'Sorry, I couldn\'t generate a response. Please try again.';
                    }
                } catch (error) {
                    responseText.textContent = 'An error occurred. Please check your network connection or try again later.';
                } finally {
                    askButton.disabled = false;
                }
            });
        });