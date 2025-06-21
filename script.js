document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card'); // 초기 9개의 선택 버튼
    const getPredictionBtn = document.getElementById('getPredictionBtn');
    const resetBtn = document.getElementById('resetBtn');
    const predictionResultDiv = document.getElementById('predictionResult');
    const userQuestionInput = document.getElementById('userQuestion');
    const magicButton = document.getElementById('magicButton');
    const cardSelectionArea = document.getElementById('cardSelectionArea');
    let selectedCardButton = null; // 초기 9개 버튼 중 선택된 버튼 (이젠 타로 카드 자체가 아님)

    // 78장의 타로 카드 목록 (메이저 아르카나 22장, 마이너 아르카나 56장)
    // 각 카드는 'name', 'keywords', 'interpretation' (상세 의미)를 가집니다.
    const fullTarotDeck = [
        // 메이저 아르카나
        { name: '0. 광대 (The Fool)', keywords: '새로운 시작, 자유, 무한한 가능성, 순수함, 모험', interpretation: '인생의 새로운 여정을 시작할 준비가 되었습니다. 미지의 영역으로 뛰어들 용기가 필요하며, 과거의 짐을 내려놓고 자유롭게 나아가세요. 예상치 못한 기회가 찾아올 수 있습니다.' },
        { name: 'I. 마법사 (The Magician)', keywords: '창조력, 능력, 의지력, 집중, 시작', interpretation: '당신에게는 모든 것을 현실로 만들 수 있는 잠재력과 도구가 있습니다. 아이디어를 구체화하고 행동으로 옮길 때입니다. 자신감을 가지고 목표를 향해 집중하세요.' },
        { name: 'II. 여사제 (The High Priestess)', keywords: '직관, 비밀, 무의식, 신비, 지혜', interpretation: '내면의 목소리에 귀 기울이고 직관을 믿어야 할 때입니다. 겉으로 드러나지 않는 비밀이나 숨겨진 진실이 있을 수 있습니다. 깊은 명상과 성찰을 통해 답을 찾으세요.' },
        { name: 'III. 여왕 (The Empress)', keywords: '풍요, 창조성, 모성, 자연, 아름다움', interpretation: '풍요와 번영이 당신의 삶에 찾아옵니다. 창의적인 에너지가 넘치고, 사랑과 보살핌을 통해 주변을 풍요롭게 만들 수 있습니다. 자연과의 교감도 중요합니다.' },
        { name: 'IV. 황제 (The Emperor)', keywords: '권위, 리더십, 안정, 통제, 아버지상', interpretation: '강력한 리더십과 통제력이 필요한 시기입니다. 질서를 세우고 체계적으로 일을 진행하여 안정적인 기반을 다지세요. 때로는 단호하고 결단력 있는 태도가 요구됩니다.' },
        { name: 'V. 교황 (The Hierophant)', keywords: '전통, 가르침, 제도, 영적 지도, 교육', interpretation: '규칙과 전통을 따르거나, 멘토로부터 지혜를 구할 때입니다. 영적인 안내나 교육을 통해 답을 찾을 수 있습니다. 기존의 가치관이나 신념에 대해 생각해 보세요.' },
        { name: 'VI. 연인 (The Lovers)', keywords: '사랑, 관계, 선택, 조화, 동반자', interpretation: '중요한 선택의 기로에 놓일 수 있습니다. 특히 인간관계나 사랑에 관련된 문제입니다. 진심을 따르고 당신의 가치관과 일치하는 길을 선택하세요.' },
        { name: 'VII. 전차 (The Chariot)', keywords: '승리, 결단력, 통제, 진보, 자아 성취', interpretation: '강력한 의지와 추진력으로 목표를 향해 나아가세요. 내부의 갈등을 극복하고 통제력을 발휘하면 큰 성공을 거둘 수 있습니다. 당신의 노력이 결실을 맺을 때입니다.' },
        { name: 'VIII. 힘 (Strength)', keywords: '용기, 인내, 내면의 힘, 통제, 연민', interpretation: '외적인 힘보다는 내면의 용기와 인내가 중요한 시기입니다. 부드러움으로 강함을 다스리며, 어려운 상황을 침착하게 극복할 수 있습니다. 당신 안의 강인함을 믿으세요.' },
        { name: 'IX. 은둔자 (The Hermit)', keywords: '성찰, 고독, 내면의 안내, 지혜 탐구', interpretation: '잠시 멈춰 서서 내면을 깊이 들여다보고 성찰할 시간이 필요합니다. 혼자만의 시간을 가지며 자신을 돌아보고 진정한 지혜를 찾아보세요. 외부의 소음에서 벗어나세요.' },
        { name: 'X. 운명의 수레바퀴 (Wheel of Fortune)', keywords: '운명, 전환점, 행운, 변화, 순환', interpretation: '인생의 중요한 전환점이나 예상치 못한 행운이 찾아올 수 있습니다. 변화를 받아들이고 흐름에 몸을 맡기세요. 운명의 바퀴가 당신에게 유리하게 돌아가고 있습니다.' },
        { name: 'XI. 정의 (Justice)', keywords: '정의, 균형, 공정함, 진실, 법적 문제', interpretation: '모든 상황을 공정하고 객관적으로 판단해야 할 때입니다. 진실이 밝혀지고 균형이 맞춰질 것입니다. 법적 문제나 중요한 결정에 있어서 정의로운 결과를 기대할 수 있습니다.' },
        { name: 'XII. 매달린 남자 (The Hanged Man)', keywords: '희생, 새로운 관점, 포기, 깨달음, 인내', interpretation: '지금은 잠시 멈춰 서서 다른 관점으로 상황을 바라볼 필요가 있습니다. 희생이나 포기를 통해 새로운 깨달음을 얻을 수 있습니다. 인내심을 가지고 기다리면 답이 보일 것입니다.' },
        { name: 'XIII. 죽음 (Death)', keywords: '변화, 끝, 재탄생, 전환, 정리', interpretation: '낡은 것이 끝나고 새로운 시작이 찾아옵니다. 두려워하지 말고 변화를 받아들이세요. 불필요한 것을 정리하고 과거와 단절함으로써 진정한 재탄생을 이룰 수 있습니다.' },
        { name: 'XIV. 절제 (Temperance)', keywords: '균형, 조화, 인내, 중용, 치유', interpretation: '모든 면에서 균형과 조화를 이루는 것이 중요합니다. 인내심을 가지고 상반된 요소들을 조화롭게 통합하려 노력하세요. 치유와 회복의 에너지가 강합니다.' },
        { name: 'XV. 악마 (The Devil)', keywords: '속박, 유혹, 중독, 물질주의, 그림자 자아', interpretation: '어떤 것에 얽매여 있거나 유혹에 빠져있을 수 있습니다. 물질적인 욕망이나 중독에서 벗어나야 합니다. 자신의 그림자 자아를 직면하고 통제력을 되찾으세요.' },
        { name: 'XVI. 탑 (The Tower)', keywords: '갑작스러운 변화, 파괴, 혼란, 해방, 깨어남', interpretation: '예상치 못한 급진적인 변화나 혼란이 닥칠 수 있습니다. 기존의 구조가 무너질 수 있지만, 이는 결국 진실을 깨닫고 해방되는 과정입니다. 이 변화를 통해 더 단단해질 수 있습니다.' },
        { name: 'XVII. 별 (The Star)', keywords: '희망, 영감, 치유, 평온, 긍정적인 미래', interpretation: '희망과 영감이 당신을 감싸는 시기입니다. 당신의 꿈을 향해 나아가세요. 치유와 평온이 찾아오며, 긍정적인 미래를 기대할 수 있습니다. 우주의 에너지가 당신을 돕고 있습니다.' },
        { name: 'XVIII. 달 (The Moon)', keywords: '직관, 환상, 무의식, 불확실성, 꿈', interpretation: '모든 것이 명확하지 않고 불확실할 수 있습니다. 꿈과 직관에 집중하고 내면의 소리에 귀 기울이세요. 숨겨진 감정이나 진실이 드러날 수 있으니 주의 깊게 살펴보세요.' },
        { name: 'XIX. 태양 (The Sun)', keywords: '성공, 행복, 활력, 기쁨, 명료함', interpretation: '가장 긍정적인 카드 중 하나입니다! 성공, 행복, 활력이 당신을 기다립니다. 모든 것이 명확해지고 기쁨이 넘치는 시기입니다. 자신감을 가지고 빛나는 에너지를 발산하세요.' },
        { name: 'XX. 심판 (Judgement)', keywords: '부활, 심판, 용서, 재평가, 각성', interpretation: '과거의 행동에 대한 결과를 마주하고 재평가할 시기입니다. 용서와 해방을 통해 새로운 삶으로 나아갈 수 있습니다. 중요한 결정이 내려지고 영적인 각성이 일어날 수 있습니다.' },
        { name: 'XXI. 세계 (The World)', keywords: '완성, 성취, 통합, 완벽함, 여행', interpretation: '당신이 시작한 일이 완전한 성공과 성취를 이룰 것입니다. 노력의 결실을 맺고 통합감을 느끼는 시기입니다. 큰 프로젝트의 완성과 다음 단계로의 준비를 의미합니다.' },

        // 마이너 아르카나 - 완드 (Wands)
        { name: '완드 에이스 (Ace of Wands)', keywords: '새로운 시작, 영감, 창의력, 열정', interpretation: '새로운 아이디어와 열정이 솟아오릅니다. 창의적인 프로젝트나 모험을 시작하기에 완벽한 시기입니다. 당신의 열정을 따르세요!' },
        { name: '완드 2 (Two of Wands)', keywords: '계획, 미래, 결정, 발견', interpretation: '미래를 계획하고 중요한 결정을 내릴 때입니다. 당신의 비전을 확장하고 새로운 가능성을 탐색하세요. 다음 단계를 신중하게 준비하세요.' },
        { name: '완드 3 (Three of Wands)', keywords: '확장, 해외 무역, 파트너십, 미래를 내다봄', interpretation: '당신의 노력이 결실을 맺고 확장될 시기입니다. 해외와의 연결이나 파트너십이 도움이 될 수 있습니다. 넓은 시야로 미래를 내다보세요.' },
        { name: '완드 4 (Four of Wands)', keywords: '축하, 안정, 조화, 집, 공동체', interpretation: '성공과 안정의 축하가 기다리고 있습니다. 집이나 공동체에서의 행복과 조화를 의미합니다. 편안하고 즐거운 시간을 보내세요.' },
        { name: '완드 5 (Five of Wands)', keywords: '경쟁, 갈등, 불일치, 도전', interpretation: '경쟁적인 상황이나 의견 불일치에 직면할 수 있습니다. 이는 성장을 위한 건전한 도전이 될 수 있습니다. 당신의 의견을 주장하고 문제를 해결하세요.' },
        { name: '완드 6 (Six of Wands)', keywords: '승리, 성공, 대중의 인정, 자부심', interpretation: '당신의 노력이 인정받고 큰 성공을 거둘 것입니다. 대중의 찬사를 받거나 승리의 기쁨을 누릴 수 있습니다. 자신감을 가지고 당당하게 나아가세요.' },
        { name: '완드 7 (Seven of Wands)', keywords: '방어, 도전, 결단력, 용기', interpretation: '도전적인 상황에서 자신을 방어하고 결단력을 발휘해야 합니다. 경쟁자나 장애물에 맞설 용기가 필요합니다. 당신의 입지를 굳건히 지키세요.' },
        { name: '완드 8 (Eight of Wands)', keywords: '빠른 진행, 행동, 여행, 소식', interpretation: '상황이 빠르게 진행되고 있음을 나타냅니다. 중요한 소식이 오거나 갑작스러운 여행을 떠날 수 있습니다. 주저하지 말고 행동하세요.' },
        { name: '완드 9 (Nine of Wands)', keywords: '인내, 회복력, 마지막 노력, 경계', interpretation: '오랜 노력 끝에 거의 목표에 도달했습니다. 마지막까지 인내심을 가지고 경계심을 늦추지 마세요. 당신의 회복력이 빛을 발할 것입니다.' },
        { name: '완드 10 (Ten of Wands)', keywords: '부담, 책임, 과로, 끝, 완성', interpretation: '많은 부담과 책임을 짊어지고 있습니다. 과로로 지쳐있을 수 있지만, 곧 목표를 달성할 것입니다. 무거운 짐을 내려놓을 때가 왔습니다.' },
        { name: '완드 시종 (Page of Wands)', keywords: '열정적인 소식, 새로운 아이디어, 모험심', interpretation: '열정적이고 흥미로운 소식이 당신에게 도착할 것입니다. 새로운 아이디어나 기회가 찾아오니, 호기심을 가지고 모험을 시작하세요.' },
        { name: '완드 기사 (Knight of Wands)', keywords: '빠른 행동, 모험, 충동적, 에너지', interpretation: '빠르고 과감한 행동이 필요한 시기입니다. 새로운 모험을 떠날 준비가 되어 있으며, 당신의 넘치는 에너지를 활용하세요. 때로는 충동적일 수 있으니 주의하세요.' },
        { name: '완드 여왕 (Queen of Wands)', keywords: '카리스마, 자신감, 독립적, 따뜻함', interpretation: '당신은 카리스마 넘치고 자신감 있으며 독립적인 사람입니다. 타인을 따뜻하게 대하며 영감을 줍니다. 당신의 리더십과 매력을 발휘하세요.' },
        { name: '완드 왕 (King of Wands)', keywords: '영감, 권위, 리더십, 비전', interpretation: '영감과 비전을 가진 강력한 리더십을 발휘할 때입니다. 당신의 아이디어를 현실로 만들고, 타인을 이끌어 나갈 수 있는 능력이 있습니다.' },

        // 마이너 아르카나 - 컵 (Cups)
        { name: '컵 에이스 (Ace of Cups)', keywords: '새로운 감정, 사랑, 직관, 기쁨', interpretation: '새로운 사랑, 우정, 또는 감성적인 만족이 시작됩니다. 당신의 마음이 열리고 영적인 기쁨을 느낄 것입니다. 직관을 따르고 감정을 받아들이세요.' },
        { name: '컵 2 (Two of Cups)', keywords: '연합, 사랑, 파트너십, 상호 존중', interpretation: '사랑과 연합을 나타내는 카드입니다. 중요한 관계가 형성되거나 기존 관계가 깊어질 수 있습니다. 서로 존중하고 협력하며 조화를 이루세요.' },
        { name: '컵 3 (Three of Cups)', keywords: '축하, 우정, 공동체, 기쁨', interpretation: '기쁨과 축하할 일이 생길 것입니다. 친구나 공동체와의 유대가 강화되고 즐거운 시간을 보내게 됩니다. 함께 모여 기쁨을 나누세요.' },
        { name: '컵 4 (Four of Cups)', keywords: '만족, 권태, 새로운 기회 거부, 명상', interpretation: '현재 상황에 만족하지 못하거나 권태를 느끼고 있을 수 있습니다. 새로운 기회가 다가오고 있지만, 이를 놓치고 있을 가능성이 있습니다. 잠시 명상하며 자신을 돌아보세요.' },
        { name: '컵 5 (Five of Cups)', keywords: '상실, 후회, 슬픔, 실망', interpretation: '과거의 상실이나 실망감에 갇혀 있을 수 있습니다. 잃어버린 것에 집중하기보다, 아직 남아있는 것에 감사하고 앞으로 나아가세요. 슬픔은 치유될 것입니다.' },
        { name: '컵 6 (Six of Cups)', keywords: '과거, 향수, 순수함, 어린 시절', interpretation: '과거의 추억이나 어린 시절의 향수를 불러일으킵니다. 옛 친구를 만나거나 과거의 상황이 반복될 수 있습니다. 순수하고 즐거웠던 기억에서 영감을 얻으세요.' },
        { name: '컵 7 (Seven of Cups)', keywords: '선택, 환상, 혼란, 많은 기회', interpretation: '다양한 선택지나 환상에 휩싸여 혼란스러울 수 있습니다. 현실적인 목표를 설정하고, 무엇이 진정으로 중요한지 명확히 해야 합니다. 꿈과 현실을 구분하세요.' },
        { name: '컵 8 (Eight of Cups)', keywords: '떠남, 탐구, 영적 여정, 포기', interpretation: '현재 상황에 만족하지 못하고 새로운 것을 찾아 떠나야 할 때입니다. 물질적인 것을 버리고 영적인 성장을 추구하는 여정이 될 수 있습니다. 미련 없이 뒤돌아서세요.' },
        { name: '컵 9 (Nine of Cups)', keywords: '소원 성취, 만족, 행복, 즐거움', interpretation: '당신의 소원이 이루어지고 큰 만족감과 행복을 느낄 것입니다. 당신의 노력이 결실을 맺고 즐거움을 누리세요. 자신에게 보상할 때입니다.' },
        { name: '컵 10 (Ten of Cups)', keywords: '완벽한 행복, 가족, 조화, 만족', interpretation: '가족과의 완벽한 행복과 조화를 나타냅니다. 정서적인 만족감과 안정감을 느낄 수 있습니다. 사랑하는 사람들과 함께 평화로운 시간을 보내세요.' },
        { name: '컵 시종 (Page of Cups)', keywords: '감성적인 소식, 새로운 감정, 예술적 감각', interpretation: '예상치 못한 감성적인 소식이 도착할 것입니다. 새로운 감정이나 사랑이 시작될 수 있습니다. 예술적인 영감이나 창의적인 재능을 발견하세요.' },
        { name: '컵 기사 (Knight of Cups)', keywords: '매력, 제안, 낭만적, 예술적', interpretation: '매력적인 제안이나 로맨틱한 기회가 찾아올 수 있습니다. 당신의 감성에 충실하고 예술적인 면을 표현하세요. 부드러운 접근이 효과적입니다.' },
        { name: '컵 여왕 (Queen of Cups)', keywords: '공감, 직관적, 감성적, 치유', interpretation: '당신은 깊은 공감 능력과 직관을 가지고 있습니다. 타인을 치유하고 위로하는 능력이 뛰어나며, 자신의 감정에 충실한 사람입니다. 내면의 평화를 찾으세요.' },
        { name: '컵 왕 (King of Cups)', keywords: '감성적 성숙, 공감, 지혜, 균형', interpretation: '감성적으로 성숙하고 지혜로운 인물입니다. 혼란스러운 상황에서도 평정심을 유지하고 타인을 이해할 수 있습니다. 감정과 이성 사이의 균형을 유지하세요.' },

        // 마이너 아르카나 - 검 (Swords)
        { name: '검 에이스 (Ace of Swords)', keywords: '새로운 진실, 명확성, 돌파구, 지성', interpretation: '명확한 진실이 드러나고 상황을 이해하게 됩니다. 새로운 아이디어나 해결책이 떠오르며, 어려운 문제를 해결할 돌파구가 열립니다. 지성을 활용하여 결정을 내리세요.' },
        { name: '검 2 (Two of Swords)', keywords: '막힘, 선택의 어려움, 회피, 균형', interpretation: '두 가지 선택지 사이에서 갈등하고 결정을 내리지 못하고 있습니다. 현실을 외면하고 회피하려 할 수 있지만, 눈을 뜨고 균형 잡힌 시각으로 바라봐야 합니다.' },
        { name: '검 3 (Three of Swords)', keywords: '상처, 슬픔, 배신, 이별', interpretation: '마음의 상처나 슬픔을 겪을 수 있습니다. 예상치 못한 배신이나 이별이 있을 수 있으나, 이 아픔을 통해 성장하고 치유의 시간을 가져야 합니다.' },
        { name: '검 4 (Four of Swords)', keywords: '휴식, 회복, 명상, 고독', interpretation: '지친 심신을 회복하고 재충전할 시간이 필요합니다. 잠시 활동을 멈추고 명상하며 내면의 평화를 찾으세요. 고독 속에서 힘을 비축해야 합니다.' },
        { name: '검 5 (Five of Swords)', keywords: '갈등, 패배, 비열함, 손실', interpretation: '갈등이나 논쟁에서 상처를 입거나 손실을 볼 수 있습니다. 때로는 비열한 방법이 사용될 수 있으니 주의하세요. 승패를 떠나 진정한 가치를 찾아야 합니다.' },
        { name: '검 6 (Six of Swords)', keywords: '이동, 전환, 어려움 극복, 새로운 여정', interpretation: '어려운 상황을 벗어나 더 나은 곳으로 이동하고 있습니다. 과거의 짐을 내려놓고 새로운 여정을 시작할 때입니다. 점진적인 변화와 희망이 찾아옵니다.' },
        { name: '검 7 (Seven of Swords)', keywords: '기만, 도피, 비밀, 기회주의', interpretation: '정직하지 못한 행동이나 비밀스러운 상황이 있을 수 있습니다. 타인을 속이거나 자신을 기만하고 있을 가능성도 있습니다. 정직하고 윤리적인 태도를 취하세요.' },
        { name: '검 8 (Eight of Swords)', keywords: '속박, 제한, 무력감, 고립', interpretation: '스스로를 가두고 무력감을 느끼고 있을 수 있습니다. 실제보다 더 심한 제약이 있다고 생각할 수 있으니, 스스로 만든 감옥에서 벗어나세요. 당신은 자유로워질 수 있습니다.' },
        { name: '검 9 (Nine of Swords)', keywords: '고통, 불안, 악몽, 죄책감', interpretation: '깊은 불안감과 걱정, 악몽에 시달릴 수 있습니다. 죄책감이나 후회가 당신을 괴롭히고 있을 수 있습니다. 이는 대부분 당신의 생각에서 비롯된 것이므로, 도움을 구하고 마음의 평화를 찾으세요.' },
        { name: '검 10 (Ten of Swords)', keywords: '끝, 파멸, 새로운 시작, 최악의 상황', interpretation: '최악의 상황이 끝나고 새로운 시작이 찾아옵니다. 고통스러운 종말이지만, 이를 통해 모든 것을 내려놓고 재탄생할 기회입니다. 더 이상 나빠질 것은 없습니다.' },
        { name: '검 시종 (Page of Swords)', keywords: '새로운 아이디어, 호기심, 직접적, 소식', interpretation: '새로운 아이디어거나 지적인 자극을 주는 소식이 도착합니다. 호기심을 가지고 탐색하며, 때로는 직설적이고 솔직한 태도가 필요합니다.' },
        { name: '검 기사 (Knight of Swords)', keywords: '도전, 공격적, 용감함, 빠른 행동', interpretation: '목표를 향해 용감하고 빠르게 돌진하는 시기입니다. 도전을 두려워하지 않고 과감하게 행동하세요. 때로는 너무 공격적이거나 충동적일 수 있으니 주의하세요.' },
        { name: '검 여왕 (Queen of Swords)', keywords: '독립적, 직접적, 명료함, 고통 극복', interpretation: '명확하고 독립적인 사고를 가진 인물입니다. 감정에 휩쓸리지 않고 논리적으로 판단하며, 어려움을 극복하는 강인함이 있습니다. 진실을 직시하세요.' },
        { name: '검 왕 (King of Swords)', keywords: '지성, 권위, 논리, 정의', interpretation: '뛰어난 지성과 분석력을 가진 권위 있는 인물입니다. 논리적이고 공정한 판단을 내리며, 정의를 추구합니다. 문제 해결 능력이 탁월합니다.' },

        // 마이너 아르카나 - 펜타클 (Pentacles)
        { name: '펜타클 에이스 (Ace of Pentacles)', keywords: '새로운 기회, 재정적 시작, 안정, 번영', interpretation: '재정적인 새로운 시작이나 물질적인 기회가 찾아옵니다. 안정적이고 견고한 기반을 다질 수 있으며, 번영의 씨앗이 뿌려집니다. 실질적인 행동을 취하세요.' },
        { name: '펜타클 2 (Two of Pentacles)', keywords: '균형, 변화, 유연성, 우선순위', interpretation: '두 가지 이상의 상황이나 책임 사이에서 균형을 잡아야 합니다. 변화에 유연하게 대처하고, 무엇이 더 중요한지 우선순위를 정해야 합니다. 저글링 능력이 필요합니다.' },
        { name: '펜타클 3 (Three of Pentacles)', keywords: '협력, 팀워크, 학습, 숙련도', interpretation: '재능 있는 사람들과 협력하여 목표를 달성할 수 있습니다. 팀워크가 중요하며, 새로운 기술을 배우고 숙련도를 높이기에 좋은 시기입니다. 당신의 노력이 인정받습니다.' },
        { name: '펜타클 4 (Four of Pentacles)', keywords: '소유, 안정, 통제, 인색함', interpretation: '물질적인 안정과 소유에 대한 욕구가 강합니다. 재산을 지키려는 경향이 있지만, 때로는 너무 인색하거나 집착할 수 있습니다. 움켜쥐기보다 나눔을 고려하세요.' },
        { name: '펜타클 5 (Five of Pentacles)', keywords: '상실, 빈곤, 역경, 소외감', interpretation: '어려움이나 상실감을 겪고 있을 수 있습니다. 물질적이든 정신적이든 결핍을 느낄 수 있지만, 도움의 손길이 가까이에 있을 수 있으니 주변을 살펴보세요. 고립되지 마세요.' },
        { name: '펜타클 6 (Six of Pentacles)', keywords: '자선, 나눔, 공정함, 주고받기', interpretation: '주고받는 균형이 중요한 시기입니다. 자선을 베풀거나 도움을 받을 수 있습니다. 공정하게 대우하고, 필요한 사람에게 베풀면 좋은 에너지가 돌아올 것입니다.' },
        { name: '펜타클 7 (Seven of Pentacles)', keywords: '노력, 인내, 보상 대기, 투자', interpretation: '지금까지의 노력을 돌아보고 결과물을 기다릴 때입니다. 당장은 만족스럽지 않아도, 인내심을 가지고 기다리면 충분한 보상이 따를 것입니다. 장기적인 관점에서 바라보세요.' },
        { name: '펜타클 8 (Eight of Pentacles)', keywords: '노력, 기술, 장인정신, 헌신', interpretation: '어떤 기술이나 전문성을 연마하기 위해 헌신적으로 노력하는 시기입니다. 꾸준한 연습과 집중을 통해 당신의 실력을 향상시키세요. 장인정신이 중요합니다.' },
        { name: '펜타클 9 (Nine of Pentacles)', keywords: '독립, 풍요, 자기 만족, 성취', interpretation: '재정적인 독립과 풍요를 누리고 있습니다. 스스로의 노력으로 성취를 이루었으며, 자기 만족감을 느낍니다. 여유와 우아함을 즐기세요.' },
        { name: '펜타클 10 (Ten of Pentacles)', keywords: '완전한 풍요, 가족 유산, 안정, 완성', interpretation: '가장 큰 물질적, 가족적 풍요와 안정을 나타냅니다. 대대손손 이어지는 유산이나 가족의 행복, 커뮤니티의 완성을 의미합니다. 모든 것이 견고하고 평화롭습니다.' },
        { name: '펜타클 시종 (Page of Pentacles)', keywords: '새로운 시작, 학습, 신중함, 재정 소식', interpretation: '새로운 배움이나 재정적인 기회가 찾아올 수 있습니다. 신중하고 실용적인 태도로 접근하세요. 끈기 있게 노력하면 좋은 결과를 얻을 수 있습니다.' },
        { name: '펜타클 기사 (Knight of Pentacles)', keywords: '근면, 책임감, 인내심, 신뢰성', interpretation: '매우 성실하고 책임감이 강하며 인내심 있는 태도를 나타냅니다. 꾸준하고 신뢰할 수 있는 방식으로 목표를 향해 나아가세요. 결코 서두르지 않습니다.' },
        { name: '펜타클 여왕 (Queen of Pentacles)', keywords: '실용적, 양육적, 안정적, 풍요', interpretation: '따뜻하고 양육적이며 실용적인 인물입니다. 주변 사람들에게 안정감을 주고 풍요를 제공합니다. 자연과 물질적인 것에 대한 깊은 이해가 있습니다.' },
        { name: '펜타클 왕 (King of Pentacles)', keywords: '성공, 번영, 안정, 실용주의, 부자', interpretation: '사업이나 재정적으로 큰 성공과 번영을 이룬 인물입니다. 매우 실용적이고 안정적이며, 물질적인 기반을 튼튼히 다졌습니다. 당신의 노력이 결실을 맺을 것입니다.' }
    ];


    // 초기 상태 설정
    cards.forEach(card => {
        card.disabled = true;
    });
    getPredictionBtn.disabled = true;
    magicButton.style.display = 'none'; // MAGIC 버튼 숨김
    cardSelectionArea.style.display = 'none'; // 카드 선택 영역 숨김

    // 질문 입력 시 MAGIC 버튼 활성화/비활성화
    userQuestionInput.addEventListener('input', () => {
        const questionText = userQuestionInput.value.trim();
        if (questionText.length > 0) {
            magicButton.style.display = 'block'; // 질문 있으면 MAGIC 버튼 표시
            magicButton.disabled = false;
        } else {
            magicButton.style.display = 'none'; // 질문 없으면 MAGIC 버튼 숨김
            magicButton.disabled = true;
            resetCardSelection(); // 질문이 지워지면 카드 선택 초기화
        }
    });

    // MAGIC 버튼 클릭 시 카드 영역 표시 및 카드 활성화
    magicButton.addEventListener('click', () => {
        if (userQuestionInput.value.trim().length > 0) {
            cardSelectionArea.style.display = 'grid'; // 카드 선택 영역 표시 (CSS의 grid 속성)
            cards.forEach(card => {
                card.disabled = false; // 카드 활성화
            });
            magicButton.disabled = true; // MAGIC 버튼 비활성화 (한 번만 누르도록)
            userQuestionInput.readOnly = true; // 질문 입력창 읽기 전용으로 변경
        }
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.disabled) { // 카드가 비활성화 상태면 클릭 동작 안 함
                return;
            }

            // 여기서는 9개의 버튼 중 하나를 선택하는 로직만 수행
            if (selectedCardButton) { // 이미 선택된 버튼이 있다면
                selectedCardButton.classList.remove('selected');
            }
            card.classList.add('selected');
            selectedCardButton = card; // 선택된 버튼 저장 (data-card 값은 더 이상 중요하지 않음)
            
            getPredictionBtn.disabled = false; // 9개 중 하나를 선택하면 '마음의 버튼' 활성화
        });
    });

    getPredictionBtn.addEventListener('click', () => {
        if (selectedCardButton) { // 9개 버튼 중 하나가 선택되었는지 확인
            displayPrediction();
        } else {
            alert('카드를 한 장 선택해주세요.');
        }
    });

    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    function displayPrediction() {
        const userQuestion = userQuestionInput.value.trim();
        let predictionHtml = '<h2>당신의 예언 결과:</h2>';

        if (userQuestion) {
            predictionHtml += `<p><strong>질문:</strong> ${userQuestion}</p><hr>`;
        } else {
            predictionHtml += `<p><strong>(질문 없이 카드를 뽑으셨습니다.)</strong></p><hr>`;
        }

        // 78장의 카드 중 무작위로 한 장 선택
        const randomIndex = Math.floor(Math.random() * fullTarotDeck.length);
        const randomCard = fullTarotDeck[randomIndex];

        predictionHtml += `
            <div class="card-prediction">
                <h3>뽑힌 카드: ${randomCard.name}</h3>
                <p><strong>키워드:</strong> ${randomCard.keywords}</p>
                <p><strong>상징 및 해석:</strong></p>
                <p>${randomCard.interpretation}</p>
            </div>
            <hr>
        `;
        predictionResultDiv.innerHTML = predictionHtml;
        predictionResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 예언이 표시된 후에는 '마음의 버튼'과 초기 9개 카드 버튼 비활성화
        getPredictionBtn.disabled = true;
        cards.forEach(card => {
            card.disabled = true;
        });
    }

    function resetCardSelection() {
        if (selectedCardButton) {
            selectedCardButton.classList.remove('selected');
            selectedCardButton = null;
        }
        cards.forEach(card => {
            card.disabled = true;
        });
        getPredictionBtn.disabled = true;
        cardSelectionArea.style.display = 'none'; // 카드 선택 영역 숨김
    }

    function resetGame() {
        resetCardSelection();
        predictionResultDiv.innerHTML = '';
        userQuestionInput.value = '';
        userQuestionInput.readOnly = false; // 질문 입력창 다시 활성화
        magicButton.style.display = 'none'; // MAGIC 버튼 숨김
        magicButton.disabled = true; // MAGIC 버튼 비활성화
    }
});