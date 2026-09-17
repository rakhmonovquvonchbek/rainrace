/* Common English words for learners. Tiers slice this frequency-ordered list. */
var RAIN_WORDS = (function () {
  var raw = (
    "the of and to a in is you that it he was for on are as with his they at " +
    "be this have from or one had by word but not what all were we when your " +
    "can said there use an each which she do how their if will up other about " +
    "out many then them these so some her would make like him into time has " +
    "look two more write go see number no way could people my than first water " +
    "been call who oil now find down day did get come made may part over new " +
    "sound take only little work know place year live me back give most very " +
    "after thing our just name good sentence man think say great where help " +
    "through much before line right too mean old any same tell boy follow want " +
    "show also around form three small set put end does another well large " +
    "must big even such because turn here why ask went men read need land " +
    "different home us move try kind hand picture again change off play spell " +
    "air away animal house point page letter mother answer found study still " +
    "learn should world high every near add food between own below country " +
    "plant last school father keep tree never start city earth eye light " +
    "thought head under story left few while along might close something seem " +
    "next hard open example begin life always those both paper together got " +
    "group often run important until children side feet car mile night walk " +
    "white sea began grow took river four carry state once book hear stop " +
    "without second later miss idea enough eat face watch far real almost let " +
    "above girl sometimes mountain cut young talk soon list song being leave " +
    "family it's body music color stand sun question fish area mark dog horse " +
    "birds problem complete room knew since ever piece told usually didn't " +
    "friends easy heard order red door sure become top ship across today " +
    "during short better best however low hours black products happened whole " +
    "measure remember early waves reached listen wind rock space covered fast " +
    "several hold himself toward five step morning passed vowel true hundred " +
    "against pattern numeral table north slowly money map farm pulled draw " +
    "voice seen cold cried plan notice south sing war ground fall king town " +
    "I'll unit figure certain field travel wood fire upon done English road " +
    "half ten fly gave box finally wait correct oh quickly person became shown " +
    "minutes strong verb stars front feel fact inches street decided contain " +
    "course surface produce building ocean class note nothing rest carefully " +
    "scientists inside wheels stay green known island week less machine base " +
    "ago stood plane system behind ran round boat game force brought understand " +
    "warm common bring explain dry though language shape deep thousands yes " +
    "clear equation yet government filled heat full hot check object am rule " +
    "among noun power cannot able six size dark ball material special heavy " +
    "fine pair circle include built can't matter square syllables perhaps bill " +
    "felt suddenly test direction center farmers ready anything divided energy " +
    "subject Europe moon region return believe dance members picked simple " +
    "cells paint mind love cause rain exercise eggs train blue wish drop " +
    "developed window difference distance heart sit sum summer wall forest " +
    "probably legs sat main winter wide written length reason kept interest " +
    "arms brother race present beautiful store job edge past sign record " +
    "finished discovered wild happy beside gone sky glass million west lay " +
    "weather root instruments meet third months paragraph raised represent " +
    "soft whether clothes flowers shall teacher held describe drive cross " +
    "speak solve appear metal son either ice sleep village factors result " +
    "jumped snow ride care floor hill pushed baby buy century outside everything " +
    "tall already instead phrase soil bed copy free hope spring case laughed " +
    "nation quite type themselves temperature bright lead everyone method " +
    "section lake consonant within dictionary hair age amount scale pounds " +
    "although per broken moment tiny pole possible gold milk quiet natural " +
    "lot stone act build middle speed count cat someone sail received child " +
    "valley cents melody itself else islanders rather cuter delicious sorry " +
    "please thank friend familyless " +
    "people's " +
    "computer information service provide however local current major social " +
    "economic political national international public private personal general " +
    "specific similar various available required expected considered according " +
    "including following related involved based using usingly " +
    "create support report control process research development experience " +
    "education community company business market industry technology science " +
    "history culture society nature human health safety security quality " +
    "value level rate range change increase reduce improve produce perform " +
    "design project program system data result effect effort action decision " +
    "policy issue problem solution opportunity challenge success failure " +
    "leader manager worker student teacher doctor patient parent child " +
    "woman women man men person people group team member role " +
    "city town village country world place area region position location " +
    "house home room building office school hospital hotel shop store " +
    "street road path river mountain forest island beach garden park " +
    "car bus train plane boat bike walk run drive ride fly " +
    "water food bread milk meat fruit apple orange rice tea coffee " +
    "morning afternoon evening night today tomorrow yesterday week month year " +
    "hour minute second time clock watch calendar " +
    "one two three four five six seven eight nine ten eleven twelve " +
    "hundred thousand million billion first second third last next " +
    "red blue green yellow black white brown gray pink orange purple " +
    "big small large little long short tall high low wide deep " +
    "good bad happy sad angry tired hungry thirsty sick well " +
    "hot cold warm cool wet dry clean dirty hard soft fast slow " +
    "old new young early late soon now then always never often sometimes " +
    "yes no maybe sure true false right wrong same different " +
    "I you he she we they me him her us them my your his our their " +
    "this that these those here there where when why how what who " +
    "and but or so if because although while until before after " +
    "in on at to from by with without about into onto over under " +
    "up down out off away back around through across between among " +
    "can could will would shall should may might must need want like " +
    "go come see look watch hear listen speak talk say tell ask " +
    "know think feel believe remember forget learn teach study read write " +
    "make do take give get put keep let help use try find lose " +
    "start stop begin finish open close turn move sit stand walk " +
    "eat drink sleep wake work play live die grow become stay leave " +
    "buy sell pay cost spend save win lose choose decide agree " +
    "love hate hope wish worry wait meet call send receive bring carry " +
    "family mother father brother sister son daughter baby friend " +
    "name age job money price number phone address email letter " +
    "book paper pen story news idea question answer word language " +
    "school class lesson test exam grade homework teacher student " +
    "body head eye ear nose mouth hand foot arm leg heart " +
    "day night sun moon star sky cloud rain wind snow storm " +
    "fire light dark shadow sound music song voice " +
    "door window wall floor table chair bed desk bag " +
    "clothes shirt dress shoe hat coat " +
    "animal dog cat bird fish horse cow sheep chicken " +
    "tree flower grass leaf seed plant garden " +
    "country city map north south east west left right " +
    "please thank sorry hello goodbye yes no " +
    "important necessary possible impossible difficult easy simple " +
    "beautiful wonderful terrible dangerous safe famous special " +
    "enough almost already still even only just also too very really " +
    "each every all some any many much few little more most less " +
    "both another other others such same " +
    "once twice again never ever always " +
    "inside outside above below near far " +
    "first finally suddenly quickly slowly carefully quietly " +
    "today tonight tomorrow yesterday weekend " +
    "breakfast lunch dinner meal kitchen " +
    "doctor hospital medicine health sick pain " +
    "police law court crime safety " +
    "army war peace fight attack defend " +
    "king queen prince president government vote " +
    "church religion god believe prayer " +
    "art picture film movie camera photo " +
    "sport game team ball football tennis swim " +
    "computer internet website email message phone " +
    "electric power energy machine engine oil gas " +
    "metal wood plastic glass paper stone " +
    "color shape size weight length height " +
    "circle square line point corner side " +
    "cause effect reason purpose result " +
    "plan idea method way step stage " +
    "risk chance luck fortune accident mistake " +
    "hope fear surprise interest attention " +
    "strong weak heavy light thick thin sharp " +
    "full empty open closed broken fixed " +
    "public private local national foreign " +
    "single double half whole complete " +
    "common rare usual unusual normal strange " +
    "future past present history memory " +
    "travel journey trip visit arrive depart " +
    "ticket hotel airport station platform " +
    "shop market price cheap expensive cost " +
    "food restaurant cook taste sweet salt " +
    "child adult teenager person people " +
    "smile laugh cry shout whisper " +
    "touch hold push pull lift drop " +
    "cut break build repair clean wash " +
    "wear dress fit size style " +
    "sleep dream rest wake tired " +
    "work office meeting report boss " +
    "farm field crop wheat corn rice " +
    "sea ocean wave beach sand fish " +
    "mountain hill valley river lake " +
    "forest tree bird wild animal " +
    "city traffic busy quiet street " +
    "bridge tunnel station airport " +
    "school university college library " +
    "science experiment research discovery " +
    "math number count add subtract multiply divide " +
    "equal total average amount " +
    "weather climate season spring summer autumn winter " +
    "storm thunder lightning rain cloud " +
    "temperature degree hot cold freeze melt " +
    "island continent earth world planet " +
    "space star moon rocket satellite " +
    "time clock hour minute second " +
    "week month year century decade " +
    "morning noon midnight dawn dusk " +
    "news media radio television newspaper " +
    "story novel poem author writer " +
    "language word sentence meaning translate " +
    "question answer discuss explain describe " +
    "agree disagree argue decide choose " +
    "true false real actual fact opinion " +
    "right wrong fair unfair legal illegal " +
    "kind cruel polite rude friendly " +
    "brave afraid calm nervous excited " +
    "rich poor success fail win lose " +
    "health fitness exercise sport run " +
    "heart blood skin bone muscle " +
    "hospital nurse doctor patient treatment " +
    "danger warning careful accident " +
    "protect save rescue help support " +
    "share join connect relate compare " +
    "include contain consist depend " +
    "create invent discover develop improve " +
    "destroy damage lose waste " +
    "collect gather keep store " +
    "send receive deliver return " +
    "enter leave remain continue " +
    "increase decrease grow reduce " +
    "accept refuse allow prevent " +
    "require expect prefer avoid " +
    "notice realize understand remember " +
    "imagine guess suppose consider " +
    "suggest advise recommend offer " +
    "thank welcome celebrate enjoy " +
    "prepare organize arrange manage " +
    "control check test prove " +
    "measure weigh count record " +
    "draw paint design build " +
    "sing dance act perform " +
    "cook bake boil mix " +
    "grow plant harvest pick " +
    "drive ride fly sail " +
    "search seek hunt catch " +
    "hide show reveal cover " +
    "fill empty load carry " +
    "tie lock unlock open " +
    "press click type print " +
    "call text email write " +
    "wait hurry rush delay " +
    "start finish complete remain " +
    "begin end pause resume " +
    "try attempt fail succeed " +
    "practice train skill talent " +
    "habit custom tradition culture " +
    "rule law order freedom " +
    "right duty responsibility " +
    "hope dream goal target " +
    "plan schedule calendar date " +
    "event party festival holiday " +
    "gift present surprise " +
    "friend neighbor stranger guest " +
    "team club group crowd " +
    "leader follower partner rival " +
    "winner loser player coach " +
    "score point match race " +
    "track road lane path " +
    "speed pace distance finish " +
    "engine wheel brake light " +
    "rain night neon glow " +
    "storm cloud thunder lightning " +
    "quiet silent loud noise " +
    "bright dark shadow shine " +
    "wet dry flood puddle " +
    "fast slow sudden gradual " +
    "smooth rough sharp blunt " +
    "clear fog mist haze " +
    "city street lamp window " +
    "drive shift gear pedal " +
    "focus attention memory " +
    "accuracy error mistake correct " +
    "streak record personal best " +
    "practice daily weekly " +
    "learn review repeat remember " +
    "simple common useful basic " +
    "advance further extra beyond " +
    "choice option select pick " +
    "default setting mode level " +
    "starter common steady " +
    "keyboard finger letter character " +
    "space enter escape mute " +
    "screen canvas track car " +
    "rival racer driver lane " +
    "finish line result chart " +
    "history average trend " +
    "silent rain race type " +
    "apple banana bread butter cheese chicken chocolate cookie cream " +
    "dinner dish egg flour fruit garden grape honey juice kitchen " +
    "lemon lunch meal meat milk orange peach pepper potato rice " +
    "salad salt sandwich soup sugar tea tomato vegetable water wine " +
    "airport bicycle bridge building bus camera clock computer door " +
    "elevator engine factory garage garden hospital hotel house island " +
    "library market museum office park station store street theater " +
    "university village window " +
    "angry beautiful brave busy careful clever cold comfortable " +
    "dangerous dark delicious dirty dry empty famous fast " +
    "friendly funny happy healthy heavy honest hungry important " +
    "interesting kind lazy loud lucky modern nervous nice noisy " +
    "poor pretty quiet rich sad safe serious short sick slow " +
    "small smart strange strong stupid successful tall thin tired " +
    "ugly useful warm weak wet wide wonderful young " +
    "always never often rarely seldom sometimes usually " +
    "already finally just still yet " +
    "because although however therefore instead otherwise " +
    "across against along among around behind beside between beyond " +
    "during except inside near opposite outside toward underneath " +
    "accept arrive believe borrow cancel catch celebrate complain " +
    "complete consider continue decide deliver depend describe disappear " +
    "discover discuss divide enjoy explain fail forget forgive " +
    "happen imagine improve include introduce invite join laugh " +
    "listen manage mention notice offer prefer prepare promise " +
    "protect receive recognize refuse remember repeat replace " +
    "return seem smile succeed suggest surprise travel wonder worry " +
    "ability activity adventure agreement attention behavior chance " +
    "choice comfort community conversation courage decision difference " +
    "direction discussion education emotion energy environment example " +
    "experience feeling freedom friendship future government happiness " +
    "health history information knowledge language memory nature " +
    "opinion opportunity patience pleasure population practice " +
    "problem progress purpose quality relationship science society " +
    "solution success surprise technology tradition understanding " +
    "afternoon autumn breakfast century daughter evening exercise " +
    "holiday husband island journey kitchen library marriage " +
    "neighbor passenger passenger railway restaurant Saturday Sunday " +
    "teacher telephone television traffic weather weekend yesterday " +
    "zero one two three four five six seven eight nine ten " +
    "eleven twelve thirteen fourteen fifteen twenty thirty forty fifty " +
    "hundred thousand million " +
    "north south east west left right up down " +
    "circle square triangle rectangle " +
    "spring summer autumn winter " +
    "Monday Tuesday Wednesday Thursday Friday Saturday Sunday " +
    "January February March April May June July August " +
    "September October November December " +
    "red orange yellow green blue purple pink brown black white gray " +
    "cat dog bird fish horse cow pig sheep chicken duck rabbit mouse " +
    "tree flower grass leaf seed root branch forest garden park " +
    "sun moon star cloud rain snow wind storm thunder lightning fog " +
    "mountain river lake ocean sea beach island desert valley hill " +
    "bread butter cheese milk egg meat fish rice pasta soup salad " +
    "apple banana orange grape lemon peach strawberry tomato potato " +
    "shirt pants dress shoe hat coat jacket sock " +
    "table chair bed sofa desk lamp phone book pen paper bag " +
    "car bus train plane boat bike truck taxi " +
    "mother father sister brother baby uncle aunt cousin " +
    "teacher doctor nurse farmer driver artist singer writer " +
    "happy sad angry tired hungry thirsty sick well " +
    "big small long short tall short high low " +
    "hot cold warm cool wet dry clean dirty " +
    "fast slow early late old new young " +
    "good bad nice kind rude polite " +
    "open close start stop come go " +
    "give take put get make do " +
    "see look watch hear listen " +
    "speak talk say tell ask " +
    "know think feel want need " +
    "like love hate hope wish " +
    "help call wait meet find " +
    "work play live stay leave " +
    "eat drink sleep walk run " +
    "buy sell pay spend save " +
    "read write draw paint sing " +
    "learn teach study remember forget " +
    "please thank sorry hello goodbye " +
    "yes no maybe sure okay " +
    "this that these those " +
    "here there where when why how " +
    "who what which whose whom " +
    "I you he she it we they " +
    "my your his her its our their " +
    "me him her us them " +
    "and but or so if because " +
    "in on at to from by with " +
    "up out off over under again " +
    "very really quite almost enough " +
    "always never often sometimes " +
    "today tomorrow yesterday tonight " +
    "now then soon later already still " +
    "one two three four five " +
    "first second third last next " +
    "many much few little more most " +
    "all some any every each both " +
    "big small large little " +
    "new old young early " +
    "good great best better " +
    "true real actual right " +
    "same other another different " +
    "own personal public private " +
    "local city country world " +
    "home house room place " +
    "time day week month year " +
    "man woman child people " +
    "friend family group team " +
    "school work job life " +
    "water food air fire " +
    "hand eye head face " +
    "night light dark rain " +
    "road car city street " +
    "book word story idea " +
    "problem question answer " +
    "change move turn keep " +
    "show use try let " +
    "begin become remain continue " +
    "create produce provide include " +
    "report result effect cause " +
    "power force energy light " +
    "system process method way " +
    "level rate amount number " +
    "area part side end " +
    "point line form type " +
    "case fact example reason " +
    "plan action step goal " +
    "value cost price money " +
    "health safety risk danger " +
    "mind heart feeling thought " +
    "voice sound music noise " +
    "color picture image view " +
    "space place room ground " +
    "field land earth world " +
    "sea river mountain forest " +
    "city town village street " +
    "door window wall floor " +
    "table paper letter page " +
    "hour minute second moment " +
    "morning evening afternoon night " +
    "summer winter spring fall " +
    "north south east west " +
    "red blue green black white " +
    "dog cat bird horse fish " +
    "tree plant flower grass " +
    "sun moon star sky cloud " +
    "rain wind snow storm " +
    "fire water stone metal " +
    "glass ice wood oil " +
    "bread milk fruit apple " +
    "mother father child baby " +
    "teacher student school class " +
    "doctor hospital patient " +
    "friend neighbor stranger " +
    "leader member player " +
    "driver car road speed " +
    "engine wheel track race " +
    "finish start line goal " +
    "record score point win " +
    "practice skill effort " +
    "focus care attention " +
    "error mistake correct " +
    "quiet loud silent " +
    "bright dark neon glow " +
    "wet dry flood storm " +
    "fast slow sudden " +
    "smooth rough sharp " +
    "clear fog mist " +
    "lane path route " +
    "rival opponent racer " +
    "chart history average " +
    "mute sound thunder " +
    "keyboard letter character " +
    "streak accuracy speed " +
    "personal best result " +
    "menu restart enter " +
    "default common starter steady " +
    "learn English word list " +
    "simple useful basic " +
    "advance extra beyond " +
    "choice option select " +
    "setting mode level " +
    "screen canvas particle " +
    "reflection puddle asphalt " +
    "headlight taillight brake " +
    "skid bump jolt shake " +
    "fanfare thunder crack " +
    "ambience engine hum " +
    "tick click thud " +
    "pace rubber band close " +
    "profile target rival " +
    "distance integrate finish " +
    "window rolling measure " +
    "caret highlight current " +
    "stream scroll smooth " +
    "backspace extra missed " +
    "bright red error " +
    "persist local storage " +
    "chart canvas axes " +
    "mute toggle remember " +
    "first interaction audio " +
    "rain soaked night drive " +
    "type fast drive faster " +
    "able about above accept across act action actually add " +
    "address adult affect after again against age ago agree " +
    "ahead air all allow almost alone along already also " +
    "although always among amount animal another answer any " +
    "anyone anything appear apply area argue arm around " +
    "arrive art article artist as ask assume at attack " +
    "attention author available avoid away baby back bad " +
    "bag ball bank bar base be beat beautiful because " +
    "become bed before begin behavior behind believe below " +
    "best better between beyond big bill billion bit " +
    "black blood blue board body book born both box " +
    "boy break bring brother brown build building business " +
    "but buy by call camera campaign can cancer candidate " +
    "capital car card care career carry case catch cause " +
    "cell center central century certain certainly chair " +
    "challenge chance change character charge check child " +
    "choice choose church citizen city civil claim class " +
    "clear clearly close coach cold college color come " +
    "common community company compare computer concern " +
    "condition conference congress consider consumer contain " +
    "continue control cost could country couple course " +
    "court cover create crime cultural culture cup current " +
    "customer cut dark data daughter day dead deal death " +
    "debate decade decide decision deep defense degree " +
    "democrat democratic describe design despite detail " +
    "determine develop development die difference different " +
    "difficult direction director discover discuss discussion " +
    "disease do doctor dog door down draw dream drive " +
    "drop drug during each early east easy eat economic " +
    "economy edge education effect effort eight either " +
    "election else employee end energy enjoy enough enter " +
    "entire environment especially establish even evening " +
    "event ever every everybody everyone everything evidence " +
    "exactly example executive exist expect experience " +
    "expert explain eye face fact factor fail fall family " +
    "far fast father fear federal feel feeling few field " +
    "fight figure fill film final finally financial find " +
    "fine finger finish fire firm first fish five floor " +
    "fly focus follow food foot for force foreign forget " +
    "form former forward four free friend from front full " +
    "fund future game garden gas general generation get " +
    "girl give glass go goal good government great green " +
    "ground group grow growth guess gun guy hair half " +
    "hand hang happen happy hard have he head health " +
    "hear heart heat heavy help her here herself high " +
    "him himself his history hit hold home hope hospital " +
    "hot hotel hour house how however huge human hundred " +
    "husband I idea identify if image imagine impact " +
    "important improve in include including increase indeed " +
    "indicate individual industry information inside instead " +
    "institution interest interesting international interview " +
    "into investment involve issue it its itself job join " +
    "just keep key kid kill kind kitchen know knowledge " +
    "land language large last late later laugh law lawyer " +
    "lay lead leader learn least leave left leg legal " +
    "less let letter level lie life light like likely " +
    "line list listen little live local long look lose " +
    "loss lot love low machine magazine main maintain " +
    "major majority make man manage management manager " +
    "many market marriage material matter may maybe me " +
    "mean measure media medical meet meeting member memory " +
    "mention message method middle might military million " +
    "mind minute miss mission model modern moment money " +
    "month more morning most mother mouth move movement " +
    "movie Mr Mrs Ms much music must my myself name " +
    "nation national natural nature near nearly necessary " +
    "need network never new news newspaper next nice night " +
    "no none nor north not note nothing notice now " +
    "number occur of off offer office officer official " +
    "often oh oil ok old on once one only onto open " +
    "operation opportunity option or order organization " +
    "other others our out outside over own owner page " +
    "pain painting paper parent part participant particular " +
    "particularly partner party pass past patient pattern " +
    "pay peace people per perform performance perhaps period " +
    "person personal phone physical pick picture piece " +
    "place plan plant play player PM point police policy " +
    "political politics poor popular population position " +
    "positive possible power practice prepare present " +
    "president pressure pretty prevent price private probably " +
    "problem process produce product production professional " +
    "professor program project property protect prove " +
    "provide public pull purpose push put quality question " +
    "quickly quite race radio raise range rate rather " +
    "reach read ready real reality realize really reason " +
    "receive recent recently recognize record red reduce " +
    "reflect region relate relationship religious remain " +
    "remember remove report represent republican require " +
    "research resource respond response responsibility rest " +
    "result return reveal rich right rise risk road rock " +
    "role room rule run safe same save say scene school " +
    "science scientist score sea season seat second section " +
    "security see seek seem sell send senior sense series " +
    "serious serve service set seven several sex sexual " +
    "shake share she shoot short shot should shoulder show " +
    "side sign significant similar simple simply since " +
    "sing single sister sit site situation six size skill " +
    "skin small smile so social society soldier some " +
    "somebody someone something sometimes son song soon " +
    "sort sound source south southern space speak special " +
    "specific speech spend sport spring staff stage stand " +
    "standard star start state statement station stay " +
    "step still stock stop store story strategy street " +
    "strong structure student study stuff style subject " +
    "success successful such suddenly suffer suggest summer " +
    "support sure surface system table take talk tax " +
    "teacher team technology television tell ten tend " +
    "term test than thank that the their them themselves " +
    "then theory there these they thing think third this " +
    "those though thought thousand threat three through " +
    "throughout throw thus time to today together tonight " +
    "too top total tough toward town trade traditional " +
    "training travel treat treatment tree trial trip " +
    "trouble true truth try turn TV two type under " +
    "understand unit until up upon us use usually value " +
    "various very victim view violence visit voice vote " +
    "wait walk wall want war watch water way we weapon " +
    "wear week weight well west western what whatever " +
    "when where whether which while white who whole whom " +
    "whose why wide wife will win wind window wish with " +
    "within without woman wonder word work worker working " +
    "world worry worth would write writer wrong yard yeah " +
    "year yes yet you young your yourself " +
    "ability abroad absence accent accept accident account " +
    "accurate achieve acid active actor actress actual " +
    "adapt addition admire admit adult advantage adventure " +
    "advertise advice advise affair affect afford afraid " +
    "afternoon aged agency agent agree agriculture ahead " +
    "aim airline airport alarm album alcohol alive allow " +
    "ally almost alone along aloud alphabet already also " +
    "alter altogether always amaze ambition among amount " +
    "amuse analyze ancient anger angle angry animal " +
    "announce annual another answer anxiety anxious anybody " +
    "anyone anything anyway anywhere apart apartment apologize " +
    "appear apple application apply appoint approach " +
    "appropriate approve area argue argument arise arm " +
    "army around arrange arrest arrive arrow art article " +
    "artificial artist ashamed aside ask asleep aspect " +
    "assist associate assume assure astonish athlete " +
    "atmosphere attach attack attempt attend attention " +
    "attitude attract audience aunt author authority " +
    "automatic autumn available average avoid awake award " +
    "aware away awful awkward baby back background " +
    "backward bacteria bad bag bake balance ball ban " +
    "band bank bar bare barely bargain barrier base " +
    "basic basin basis basket bath battle beach bean " +
    "bear beard beat beautiful beauty because become " +
    "bed bee beef beer before beg begin behave behind " +
    "being belief believe bell belong below belt bend " +
    "beneath benefit beside besides best bet better " +
    "between beyond bicycle bid big bill bind bird " +
    "birth birthday bit bite bitter black blade blame " +
    "blank blanket bleed bless blind block blood blow " +
    "blue board boast boat body boil bomb bond bone " +
    "book boot border bore born borrow boss both " +
    "bother bottle bottom bound bowl box boy brain " +
    "branch brand brave bread break breakfast breath " +
    "breathe breed brick bridge brief bright brilliant " +
    "bring broad broadcast brother brown brush bucket " +
    "budget build bulb bullet bunch burn burst bury " +
    "bus bush business busy butter button buy by " +
    "cabin cage cake calculate call calm camera camp " +
    "campaign campus can canal cancel cancer candidate " +
    "candle cap capable capital captain capture car " +
    "card care career careful careless carpet carry " +
    "case cash castle cat catch cattle cause cave " +
    "cease ceiling celebrate cell cent center century " +
    "ceremony certain chain chair chairman chalk " +
    "challenge champagne chance change channel chapter " +
    "character charge charity charm chart chase cheap " +
    "cheat check cheek cheer cheese chemical chest " +
    "chicken chief child childhood chocolate choice " +
    "choose church cigarette cinema circle circumstance " +
    "citizen city civil claim clap class classic " +
    "classroom clean clear clerk clever climate climb " +
    "clock close cloth clothes cloud club clue coach " +
    "coal coast coat coffee coin cold collar colleague " +
    "collect college color column combine come comfort " +
    "comfortable command comment commerce commercial " +
    "commission commit committee common communicate " +
    "community company compare compete complain complete " +
    "complex complicate compose composition compound " +
    "computer conceit concentrate concept concern concert " +
    "conclude condition conduct conference confess " +
    "confidence confirm conflict confuse congratulate " +
    "connect conscious consider consist constant construct " +
    "consult consume contact contain content contest " +
    "continent continue contract contrary contrast " +
    "contribute control convenience conversation convert " +
    "convince cook cool cooperate copy corn corner " +
    "correct cost cottage cotton cough could council " +
    "count country countryside county couple courage " +
    "course court cousin cover cow crack craft crash " +
    "crazy cream create creature credit crew crime " +
    "criminal crisis critic crop cross crowd cruel " +
    "crush cry culture cup cupboard cure curious " +
    "current curtain curve custom customer cut cycle " +
    "dad damage dance danger dangerous dare dark data " +
    "date daughter dawn day dead deaf deal dear death " +
    "debate debt decade decide decision declare decline " +
    "decorate decrease deep defeat defence defend degree " +
    "delay delicate delight deliver demand department " +
    "depend depth describe desert deserve design desire " +
    "desk desperate despite destroy detail detective " +
    "determine develop device devote diagram diamond " +
    "dictionary die diet difference different difficult " +
    "dig dinner direct direction dirt dirty disappear " +
    "disappoint disaster discipline discover discuss " +
    "disease dish disk dismiss display distance distant " +
    "distinct district disturb divide division do doctor " +
    "document dog dollar door double doubt down dozen " +
    "draft drag drama drastic draw drawer dream dress " +
    "drink drive drop drown drug drum dry duck due " +
    "dull during dust duty each eager ear early earn " +
    "earth ease east easy eat economic economy edge " +
    "educate education effect effective effort egg eight " +
    "either elbow elder elect electric electricity " +
    "electronic element elephant else embarrass emerge " +
    "emotion emphasis empire employ empty enable enclose " +
    "encourage end enemy energy engine engineer enjoy " +
    "enormous enough enquire enter entertain entire " +
    "entrance envelope environment equal equipment era " +
    "error escape especially essay essential establish " +
    "estate estimate even evening event ever every " +
    "everybody evidence evil exact exam examine example " +
    "excellent except exchange excite excuse exercise " +
    "exist exit expand expect expense expensive experience " +
    "experiment expert explain explode explore export " +
    "expose express extend extra extreme eye face " +
    "facility fact factor factory fail faint fair " +
    "faith fall false familiar family famous fan fancy " +
    "far farm fashion fast fat fate father fault favor " +
    "favourite fear feast feather feature February fee " +
    "feed feel fellow female fence fever few fiction " +
    "field fifteen fifty fight figure file fill film " +
    "final finance find fine finger finish fire firm " +
    "first fish fist fit five fix flag flame flash " +
    "flat flavor flesh flight float flood floor flour " +
    "flow flower fly focus fog fold follow food fool " +
    "foot football for forbid force forecast forehead " +
    "foreign forest forever forget forgive fork form " +
    "formal former forth fortunate fortune forty forward " +
    "found foundation fountain four frame frank free " +
    "freedom freeze frequent fresh Friday fridge friend " +
    "friendly frighten from front fruit fry fuel full " +
    "fun funeral funny fur furniture further future " +
    "gain gallon game garage garden gas gate gather " +
    "general generous gentle genuine get ghost giant " +
    "gift girl give glad glance glass global glove " +
    "go goal god gold golf good goodbye govern grab " +
    "grade gradual grain grand grandfather grandmother " +
    "grant grape grass grateful grave gray great green " +
    "greet grey ground group grow guarantee guard " +
    "guess guest guide guilty guitar gun guy habit " +
    "hair half hall hammer hand handle hang happen " +
    "happy hard hardly harm hat hate have he head " +
    "health healthy hear heart heat heaven heavy heel " +
    "height hello help hence her here hero hers herself " +
    "hide high highlight highway hill him himself hire " +
    "his history hit hold hole holiday holy home honest " +
    "honey honor hook hope horn horse hospital host " +
    "hot hotel hour house household how however huge " +
    "human humor hundred hungry hunt hurry hurt husband " +
    "ice idea identify idle ignore ill illegal illness " +
    "image imagine immediate immigrant impact impatient " +
    "imply import importance important impose impossible " +
    "impress improve in inch incident include income " +
    "increase indeed independent index indicate individual " +
    "indoor industry infection inflate influence inform " +
    "informal information injure injury inner innocent " +
    "insect inside insist inspect inspire install instance " +
    "instead institution instruct instrument insult " +
    "insurance intelligence intend intense intention " +
    "interest international interpret interrupt interval " +
    "interview into introduce invent invest investigate " +
    "invitation invite involve iron island issue it " +
    "item its itself jacket jail January jar jaw jazz " +
    "jealous jeans jelly job join joke journal journey " +
    "joy judge juice July jump June jungle junior jury " +
    "just justice keen keep key kick kid kill kilo " +
    "kind king kingdom kiss kitchen knee knife knock " +
    "know knowledge lab label labor lack lady lake " +
    "lamp land language large last late later latter " +
    "laugh launch law lawn lawyer lay lazy lead leaf " +
    "league lean learn least leather leave lecture left " +
    "leg legal lemon lend length less lesson let letter " +
    "level liberty library lid lie life lift light like " +
    "likely limit line link lion lip liquid list listen " +
    "literature little live load loaf loan local lock " +
    "lonely long look loose lord lose loss lot loud " +
    "love lovely low luck lucky lunch lung machine " +
    "mad magazine magic mail main major make male " +
    "mall man manage manager manner many map marble " +
    "march mark market marriage marry mass master match " +
    "mate material math matter mature maximum may maybe " +
    "mayor meal mean meanwhile measure meat media medical " +
    "medicine meet melt member memory mental mention menu " +
    "mere merely mess message metal method middle might " +
    "mile military milk mill million mind mine mineral " +
    "minimum minister minor minute mirror miss mission " +
    "mistake mix model modern modest moment Monday money " +
    "monitor monkey month mood moon moral more moreover " +
    "morning most mother motion motor mountain mouse mouth " +
    "move movie much mud multiple murder muscle museum " +
    "music must my myself mystery nail name narrow " +
    "nation national native natural nature navy near " +
    "nearly neat necessary neck need needle negative " +
    "negotiate neighbor neither nerve nervous net network " +
    "never new news newspaper next nice night nine no " +
    "noble nobody nod noise none nor normal north nose " +
    "not note nothing notice novel now nuclear number " +
    "nurse nut object obtain obvious occasion occupy " +
    "occur ocean October odd of off offence offer office " +
    "officer official often oil okay old on once one " +
    "onion only onto open operate opinion opportunity " +
    "oppose opposite option or orange order ordinary " +
    "organ organize origin original other otherwise ought " +
    "our ours ourselves out outdoor outer outline output " +
    "outside outstanding oven over overcome owe own owner " +
    "pack package page pain paint pair palace pale pan " +
    "panel panic paper parent park part particular " +
    "partner party pass passage passenger past path " +
    "patience patient pattern pause pay peace peak " +
    "pen pencil people pepper per percent perfect perform " +
    "perhaps period permanent permit person personal " +
    "persuade pet petrol phase philosophy phone photo " +
    "phrase physical piano pick picture piece pig pile " +
    "pill pilot pin pink pipe pity place plain plan " +
    "plane plant plastic plate platform play pleasant " +
    "please pleasure plenty plot plus pocket poem poet " +
    "point pole police policy polish polite political " +
    "pollution pool poor pop popular population port " +
    "pose position positive possess possible post pot " +
    "potato potential pound pour poverty powder power " +
    "practical practice praise pray precious precise " +
    "predict prefer pregnant prepare presence present " +
    "preserve president press pressure pretend pretty " +
    "prevent previous price pride priest primary prince " +
    "principle print prior prison private prize probably " +
    "problem procedure proceed process produce product " +
    "profession professor profit program progress project " +
    "promise promote prompt proof proper property propose " +
    "protect proud prove provide public publish pull " +
    "pump punch punish pupil purchase pure purple purpose " +
    "pursue push put qualify quality quantity quarter " +
    "queen question quick quiet quite quote rabbit race " +
    "radio rail rain raise range rank rapid rare rate " +
    "rather raw reach react read ready real realize " +
    "really reason reasonable recall receive recent " +
    "recipe recognize recommend record recover red reduce " +
    "refer reflect refuse regard region register regret " +
    "regular reject relate relation relative relax " +
    "release relevant relief religion remain remark " +
    "remember remind remote remove rent repair repeat " +
    "replace reply report represent request require " +
    "rescue research resemble reserve resident resist " +
    "resolve resource respect respond responsibility rest " +
    "restaurant result retain retire return reveal " +
    "review reward rice rich rid ride right ring rise " +
    "risk river road roast rob rock role roll romantic " +
    "roof room root rope rose rough round route row " +
    "royal rub rubber rude ruin rule run rural rush " +
    "sad safe sail salad salary sale salt same sample " +
    "sand sandwich satellite satisfaction satisfy Saturday " +
    "sauce save say scale scan scare scene schedule " +
    "scheme school science scissors score screen sea " +
    "search season seat second secret secretary section " +
    "secure security see seed seek seem seize select " +
    "self sell send senior sense sensitive sentence " +
    "separate serious servant serve service session set " +
    "settle seven several severe sew sex shade shadow " +
    "shake shall shame shape share sharp shave she " +
    "sheep sheet shelf shell shelter shift shine ship " +
    "shirt shock shoe shoot shop shore short shot should " +
    "shoulder shout show shower shut shy sick side " +
    "sight sign signal significant silence silent silly " +
    "silver similar simple since sing single sink sir " +
    "sister sit site situation six size ski skill skin " +
    "skirt sky slave sleep slice slide slight slip slope " +
    "slow small smart smell smile smoke smooth snake " +
    "snow so soap social society sock soda sofa soft " +
    "soil soldier solid solve some somebody somehow " +
    "someone something sometime sometimes somewhat somewhere " +
    "son song soon sorry sort soul sound soup source " +
    "south space spare speak special specific speech " +
    "speed spell spend spirit spite split spoil spoke " +
    "spoon sport spot spread spring square stable staff " +
    "stage stain stairs stamp stand standard star stare " +
    "start state station statue status stay steady steak " +
    "steal steam steel steep steer stem step stick stiff " +
    "still sting stir stock stomach stone stop store " +
    "storm story stove straight strain strange strategy " +
    "stream street strength stress stretch strict strike " +
    "string strip stroke strong structure struggle student " +
    "studio study stuff stupid style subject substance " +
    "succeed success such suck sudden suffer sugar " +
    "suggest suit suitable suitcase sum summer sun Sunday " +
    "supermarket supply support suppose sure surface " +
    "surgery surprise surround survey survive suspect " +
    "swallow swear sweat sweater sweep sweet swell swim " +
    "swing switch sword symbol sympathy system table " +
    "tackle tail take talent talk tall tank tap tape " +
    "target task taste tax taxi tea teach team tear " +
    "telephone television tell temperature temporary ten " +
    "tend tennis tent term terrible test text than " +
    "thank that the theater their them theme themselves " +
    "then theory there therefore these they thick thief " +
    "thin thing think third thirsty this those though " +
    "thought thousand thread threat three throat through " +
    "throughout throw thumb thunder Thursday thus ticket " +
    "tide tidy tie tight till time tin tiny tip tired " +
    "title to tobacco today toe together tomato tomorrow " +
    "ton tone tongue tonight too tool tooth top topic " +
    "torch total touch tough tour toward towel tower " +
    "town toy trace track trade tradition traffic train " +
    "transfer transform translate transport trap travel " +
    "tray treat tree trend trial triangle trick trip " +
    "trouble truck true trust truth try tube Tuesday " +
    "tune tunnel turn twelve twenty twice twin two type " +
    "typical ugly umbrella uncle under understand " +
    "underwear unemployment unexpected unfair unfortunate " +
    "unhappy uniform union unique unit unite universe " +
    "university unless until unusual up upon upper upset " +
    "upstairs urban urge urgent us use useful usual " +
    "usually vacation valley valuable value van variety " +
    "various vary vase vast vegetable vehicle version " +
    "very vessel victim victory video view village " +
    "violence violent violin virus visible vision visit " +
    "visual vital vitamin voice volume volunteer vote " +
    "voyage wage wait wake walk wall want war warm " +
    "warn wash waste watch water wave way we weak " +
    "wealth weapon wear weather wedding Wednesday week " +
    "weekend weigh weight welcome well west wet whale " +
    "what wheat wheel when where whether which while " +
    "whisper white who whole whom whose why wide wife " +
    "wild will willing win wind window wine wing winter " +
    "wire wise wish wit with within without woman wonder " +
    "wood wool word work worker world worm worry worse " +
    "worst worth would wound wrap wreck wrist write " +
    "wrong yard yeah year yellow yes yesterday yet you " +
    "young your yours yourself youth zero zone zoo"
  ).split(/\s+/);

  var seen = Object.create(null);
  var out = [];
  for (var i = 0; i < raw.length; i++) {
    var w = raw[i].toLowerCase();
    if (!w || seen[w]) continue;
    if (!/^[a-z]+$/.test(w)) continue;
    if (w.length > 14) continue;
    seen[w] = 1;
    out.push(w);
  }
  return out;
})();

var WORD_TIERS = { starter: 100, common: 300, steady: 1000 };
