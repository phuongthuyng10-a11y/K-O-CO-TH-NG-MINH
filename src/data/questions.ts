import { Question } from '../types';

export const QUESTION_BANK: Question[] = [
  // --- KHOA HỌC & VŨ TRỤ ---
  {
    id: 'kn-1',
    question: 'Hành tinh nào gần Mặt Trời nhất trong Hệ Mặt Trời?',
    options: ['Sao Kim', 'Sao Thủy', 'Sao Hỏa', 'Sao Mộc'],
    correctIndex: 1,
    explanation: 'Sao Thủy (Mercury) là hành tinh nằm gần Mặt Trời nhất với khoảng cách trung bình khoảng 58 triệu km.',
    category: 'Khoa học & Vũ trụ'
  },
  {
    id: 'kn-2',
    question: 'Loài chim nào sau đây là loài duy nhất có khả năng bay lùi?',
    options: ['Chim cánh cụt', 'Chim ruồi', 'Chim bói cá', 'Chim hải âu'],
    correctIndex: 1,
    explanation: 'Chim ruồi có cấu trúc khớp cánh đặc biệt xoay được 180 độ, cho phép bay lùi và bay đứng yên.',
    category: 'Thế giới động vật'
  },
  {
    id: 'kn-3',
    question: 'Chất khí nào chiếm tỉ lệ phần trăm thể tích lớn nhất trong không khí Trái Đất?',
    options: ['Khí Oxy', 'Khí Nitơ', 'Khí Carbonic', 'Khí Argon'],
    correctIndex: 1,
    explanation: 'Khí Nitơ chiếm khoảng 78% thể tích khí quyển, trong khi Oxy chiếm khoảng 21%.',
    category: 'Khoa học & Tự nhiên'
  },
  {
    id: 'kn-4',
    question: 'Động vật nào là loài động vật có vú lớn nhất từng sinh sống trên Trái Đất?',
    options: ['Voi châu Phi', 'Cá voi xanh', 'Khủng long bạo chúa', 'Cá mập Megalodon'],
    correctIndex: 1,
    explanation: 'Cá voi xanh có thể dài tới 30 mét và nặng tới 200 tấn, là loài động vật lớn nhất lịch sử Trái Đất.',
    category: 'Thế giới động vật'
  },
  {
    id: 'kn-5',
    question: 'Quá trình quang hợp của cây cối ban ngày hấp thụ khí gì và thải ra khí gì?',
    options: ['Hút Oxy, thải CO2', 'Hút CO2, thải Oxy', 'Hút Nitơ, thải CO2', 'Hút Oxy, thải Nitơ'],
    correctIndex: 1,
    explanation: 'Quá trình quang hợp dùng ánh sáng mặt trời để chuyển CO2 và nước thành dưỡng chất và giải phóng Oxy.',
    category: 'Sinh học'
  },
  {
    id: 'kn-6',
    question: 'Vận tốc ánh sáng truyền trong chân không xấp xỉ bằng bao nhiêu?',
    options: ['30.000 km/giây', '300.000 km/giây', '1.500.000 km/giây', '3.000 km/giây'],
    correctIndex: 1,
    explanation: 'Vận tốc ánh sáng trong chân không xấp xỉ 299.792 km/s, thường làm tròn thành 300.000 km/s.',
    category: 'Vật lý'
  },
  {
    id: 'kn-7',
    question: 'Cơ quan nào trong cơ thể con người thực hiện chức năng lọc máu và bài tiết nước tiểu?',
    options: ['Trái tim', 'Lá lách', 'Hai quả thận', 'Dạ dày'],
    correctIndex: 2,
    explanation: 'Hai quả thận lọc bỏ chất cặn bã chuyển hóa và nước dư thừa khỏi máu tạo thành nước tiểu.',
    category: 'Cơ thể người'
  },
  {
    id: 'kn-8',
    question: 'Kim loại duy nhất ở thể lỏng trong điều kiện nhiệt độ phòng thông thường là kim loại nào?',
    options: ['Thủy ngân', 'Chì', 'Bạc', 'Đồng'],
    correctIndex: 0,
    explanation: 'Thủy ngân (Hg) có điểm nóng chảy là -38.83°C nên tồn tại ở thể lỏng ở nhiệt độ phòng.',
    category: 'Hóa học'
  },
  {
    id: 'kn-9',
    question: 'Hành tinh nào được gọi là "Hành tinh Đỏ" trong Hệ Mặt Trời?',
    options: ['Sao Kim', 'Sao Thổ', 'Sao Hỏa', 'Sao Mộc'],
    correctIndex: 2,
    explanation: 'Sao Hỏa có bề mặt chứa nhiều oxit sắt (gỉ sét) tạo nên màu đỏ đặc trưng.',
    category: 'Khoa học & Vũ trụ'
  },
  {
    id: 'kn-10',
    question: 'Tầng Ozone trong khí quyển có vai trò quan trọng gì đối với sự sống Trái Đất?',
    options: ['Ngăn tia cực tím độc hại', 'Tạo ra mây mưa', 'Cung cấp oxy thở', 'Giữ ánh sáng mặt trời'],
    correctIndex: 0,
    explanation: 'Tầng Ozone ở tầng bình lưu hấp thụ phần lớn bức xạ tia cực tím (UV) có hại từ Mặt Trời.',
    category: 'Khoa học Môi trường'
  },
  {
    id: 'kn-11',
    question: 'Hiện tượng cầu vồng hình thành chủ yếu do các hiện tượng quang học nào qua giọt nước mưa?',
    options: ['Khúc xạ và phản xạ ánh sáng', 'Giao thoa sóng điện từ', 'Hấp thụ ánh sáng', 'Nhiễu xạ ánh sáng'],
    correctIndex: 0,
    explanation: 'Ánh sáng trắng của Mặt Trời bị tán sắc, khúc xạ và phản xạ bên trong các giọt nước mưa li ti.',
    category: 'Vật lý'
  },
  {
    id: 'kn-12',
    question: 'Khoáng chất tự nhiên nào có độ cứng lớn nhất theo thang độ cứng Mohs?',
    options: ['Thạch anh', 'Kim cương', 'Hồng ngọc (Ruby)', 'Topaz'],
    correctIndex: 1,
    explanation: 'Kim cương đạt độ cứng tối đa 10 trên thang Mohs, là khoáng chất tự nhiên cứng nhất.',
    category: 'Khoa học Trái Đất'
  },
  {
    id: 'kn-13',
    question: 'Loài thú nào sau đây có khả năng đứng ngủ mà không bị ngã?',
    options: ['Ngựa', 'Gấu Bắc cực', 'Sư tử', 'Thỏ rừng'],
    correctIndex: 0,
    explanation: 'Ngựa sở hữu cơ chế khóa khớp chân độc đáo giúp chúng thư giãn cơ bắp và ngủ đứng để cảnh giác kẻ săn mồi.',
    category: 'Thế giới động vật'
  },
  {
    id: 'kn-14',
    question: 'Loài chim nào có kích thước và cân nặng lớn nhất thế giới hiện nay?',
    options: ['Đà điểu châu Phi', 'Đại bàng hoàng đế', 'Bồ nông trắng', 'Kền kền khoang cổ'],
    correctIndex: 0,
    explanation: 'Đà điểu châu Phi có thể cao tới 2.8 mét và nặng hơn 130 kg, dù không bay được nhưng chạy rất nhanh.',
    category: 'Thế giới động vật'
  },
  {
    id: 'kn-15',
    question: 'Đại dương nào có diện tích lớn nhất trên hành tinh Trái Đất?',
    options: ['Đại Tây Dương', 'Ấn Độ Dương', 'Thái Bình Dương', 'Bắc Băng Dương'],
    correctIndex: 2,
    explanation: 'Thái Bình Dương chiếm hơn 30% diện tích bề mặt Trái Đất và lớn hơn tổng diện tích tất cả các lục địa cộng lại.',
    category: 'Địa lý thế giới'
  },
  {
    id: 'kn-16',
    question: 'Hành tinh nào lớn nhất về thể tích và khối lượng trong Hệ Mặt Trời?',
    options: ['Sao Thổ', 'Sao Mộc', 'Sao Hải Vương', 'Sao Thiên Vương'],
    correctIndex: 1,
    explanation: 'Sao Mộc (Jupiter) có khối lượng lớn hơn 2.5 lần tổng khối lượng của tất cả các hành tinh khác trong Hệ Mặt Trời cộng lại.',
    category: 'Khoa học & Vũ trụ'
  },
  {
    id: 'kn-17',
    question: 'Vệ tinh tự nhiên duy nhất của Trái Đất là thiên thể nào?',
    options: ['Mặt Trăng', 'Sao Hỏa', 'Sao Chổi Halley', 'Trạm ISS'],
    correctIndex: 0,
    explanation: 'Mặt Trăng là vệ tinh tự nhiên duy nhất quay quanh Trái Đất, cách Trái Đất khoảng 384.400 km.',
    category: 'Khoa học & Vũ trụ'
  },
  {
    id: 'kn-18',
    question: 'Nhóm máu nào trong hệ nhóm máu ABO được xem là "nhóm máu chuyên cho"?',
    options: ['Nhóm máu A', 'Nhóm máu B', 'Nhóm máu AB', 'Nhóm máu O'],
    correctIndex: 3,
    explanation: 'Nhóm máu O không có kháng nguyên A và B trên bề mặt hồng cầu, có thể truyền cho người mang bất kỳ nhóm máu nào.',
    category: 'Y học & Sinh học'
  },
  {
    id: 'kn-19',
    question: 'Xương dài nhất và chắc khỏe nhất trong cơ thể con người là xương nào?',
    options: ['Xương cánh tay', 'Xương sườn', 'Xương đùi', 'Xương sống'],
    correctIndex: 2,
    explanation: 'Xương đùi (femur) là xương dài nhất và chịu lực tốt nhất trong toàn bộ khung xương con người.',
    category: 'Cơ thể người'
  },
  {
    id: 'kn-20',
    question: 'Động vật nào có thị lực nhìn được 360 độ và có thể đổi màu sắc da linh hoạt?',
    options: ['Tắc kè hoa', 'Thằn lằn bay', 'Bạch tuộc', 'Kỳ nhông'],
    correctIndex: 0,
    explanation: 'Tắc kè hoa có hai mắt chuyển động độc lập cho tầm nhìn bao quát 360 độ và các tế bào sắc tố biến đổi màu.',
    category: 'Thế giới động vật'
  },

  // --- ĐỊA LÝ & LỊCH SỬ VIỆT NAM ---
  {
    id: 'vn-1',
    question: 'Đỉnh núi nào được mệnh danh là "Nóc nhà Đông Dương"?',
    options: ['Bạch Mộc Lương Tử', 'Fansipan', 'Tây Côn Lĩnh', 'Langbiang'],
    correctIndex: 1,
    explanation: 'Đỉnh Fansipan cao 3.143m tại tỉnh Lào Cai là đỉnh núi cao nhất Việt Nam và cả 3 nước Đông Dương.',
    category: 'Địa lý Việt Nam'
  },
  {
    id: 'vn-2',
    question: 'Sông Mê Kông chảy qua tổng cộng bao nhiêu quốc gia trước khi đổ ra Biển Đông tại Việt Nam?',
    options: ['4 quốc gia', '5 quốc gia', '6 quốc gia', '7 quốc gia'],
    correctIndex: 2,
    explanation: 'Sông Mê Kông chảy qua 6 nước: Trung Quốc, Myanmar, Lào, Thái Lan, Campuchia và Việt Nam.',
    category: 'Địa lý'
  },
  {
    id: 'vn-3',
    question: 'Vịnh biển nào của Việt Nam được UNESCO hai lần công nhận là Di sản Thiên nhiên Thế giới?',
    options: ['Vịnh Nha Trang', 'Vịnh Hạ Long', 'Vịnh Cam Ranh', 'Vịnh Lăng Cô'],
    correctIndex: 1,
    explanation: 'Vịnh Hạ Long được UNESCO vinh danh năm 1994 (cảnh quan thẩm mỹ) và năm 2000 (địa chất địa mạo).',
    category: 'Danh lam thắng cảnh'
  },
  {
    id: 'vn-4',
    question: 'Chiến thắng cọc ngầm trên sông Bạch Đằng năm 938 gắn liền với tên tuổi vị anh hùng dân tộc nào?',
    options: ['Ngô Quyền', 'Trần Hưng Đạo', 'Lê Hoàn', 'Lý Thường Kiệt'],
    correctIndex: 0,
    explanation: 'Ngô Quyền chỉ huy trận đánh cọc ngầm đánh bại quân Nam Hán năm 938, mở ra kỷ nguyên độc lập tự chủ.',
    category: 'Lịch sử Việt Nam'
  },
  {
    id: 'vn-5',
    question: 'Tỉnh nào có diện tích đất tự nhiên lớn nhất cả nước ta hiện nay?',
    options: ['Thanh Hóa', 'Nghệ An', 'Gia Lai', 'Sơn La'],
    correctIndex: 1,
    explanation: 'Tỉnh Nghệ An có diện tích lớn nhất Việt Nam với hơn 16.490 km².',
    category: 'Địa lý Việt Nam'
  },
  {
    id: 'vn-6',
    question: 'Quần thể di tích Cố đô Huế nằm bên bờ dòng sông thơ mộng nào?',
    options: ['Sông Hồng', 'Sông Hương', 'Sông Hàn', 'Sông Thu Bồn'],
    correctIndex: 1,
    explanation: 'Cố đô Huế soi bóng bên dòng sông Hương êm đềm, thuộc tỉnh Thừa Thiên Huế.',
    category: 'Văn hóa lịch sử'
  },
  {
    id: 'vn-7',
    question: 'Nhạc cụ truyền thống nào của Việt Nam chỉ có một dây duy nhất nhưng phát ra âm sắc rất giàu cảm xúc?',
    options: ['Đàn Nguyệt', 'Đàn Bầu', 'Đàn Nhị', 'Đàn Tranh'],
    correctIndex: 1,
    explanation: 'Đàn bầu (độc huyền cầm) dùng một dây kim loại và cần vòi uốn lượn để biến chuyển âm bồi.',
    category: 'Văn hóa & Âm nhạc'
  },
  {
    id: 'vn-8',
    question: 'Hang động tự nhiên lớn nhất thế giới hiện nay nằm ở tỉnh nào của nước ta?',
    options: ['Quảng Bình (Sơn Đoòng)', 'Ninh Bình (Tràng An)', 'Cao Bằng (Ngườm Ngao)', 'Lào Cai (Tả Phìn)'],
    correctIndex: 0,
    explanation: 'Hang Sơn Đoòng thuộc Vườn quốc gia Phong Nha - Kẻ Bàng, tỉnh Quảng Bình là hang động tự nhiên kỳ vĩ nhất thế giới.',
    category: 'Địa lý & Du lịch'
  },
  {
    id: 'vn-9',
    question: 'Cây cầu bắc qua sông Hàn ở Đà Nẵng có khả năng phun lửa và phun nước biểu diễn vào cuối tuần là cầu nào?',
    options: ['Cầu Sông Hàn', 'Cầu Rồng', 'Cầu Thuận Phước', 'Cầu Trần Thị Lý'],
    correctIndex: 1,
    explanation: 'Cầu Rồng thiết kế theo hình rồng thời Lý dài 666m, có thể phun lửa và phun nước phục vụ khách du lịch.',
    category: 'Du lịch Việt Nam'
  },
  {
    id: 'vn-10',
    question: 'Kiệt tác thơ lục bát "Truyện Kiều" (Đoạn trường tân thanh) là trước tác của đại thi hào nào?',
    options: ['Nguyễn Trãi', 'Nguyễn Du', 'Hồ Xuân Hương', 'Nguyễn Đình Chiểu'],
    correctIndex: 1,
    explanation: 'Đại thi hào Nguyễn Du (1765 - 1820) là Danh nhân văn hóa thế giới, tác giả của Truyện Kiều.',
    category: 'Văn học Việt Nam'
  },
  {
    id: 'vn-11',
    question: 'Thành phố nào ở Việt Nam nổi tiếng với biệt danh "Thành phố sương mù" và "Thành phố ngàn hoa"?',
    options: ['Sa Pa', 'Đà Lạt', 'Tam Đảo', 'Bảo Lộc'],
    correctIndex: 1,
    explanation: 'Thành phố Đà Lạt (tỉnh Lâm Đồng) nằm trên cao nguyên Lâm Viên với khí hậu mát lạnh ôn đới quanh năm.',
    category: 'Địa lý Việt Nam'
  },
  {
    id: 'vn-12',
    question: 'Ngày giải phóng hoàn toàn miền Nam, thống nhất đất nước Việt Nam là ngày nào?',
    options: ['30 tháng 4 năm 1975', '1 tháng 5 năm 1975', '2 tháng 9 năm 1945', '19 tháng 8 năm 1945'],
    correctIndex: 0,
    explanation: 'Trưa ngày 30/4/1975, xe tăng quân giải phóng tiến vào Dinh Độc Lập, non sông Việt Nam liền một dải.',
    category: 'Lịch sử Việt Nam'
  },
  {
    id: 'vn-13',
    question: 'Điểm cực Bắc trên đất liền của lãnh thổ nước ta thuộc xã Lũng Cú, huyện Đồng Văn của tỉnh nào?',
    options: ['Cao Bằng', 'Hà Giang', 'Lào Cai', 'Lạng Sơn'],
    correctIndex: 1,
    explanation: 'Cột cờ Lũng Cú nằm tại đỉnh Lũng Cú thuộc tỉnh Hà Giang, đánh dấu điểm cực Bắc thiêng liêng của Tổ quốc.',
    category: 'Địa lý Việt Nam'
  },
  {
    id: 'vn-14',
    question: 'Hòn đảo có diện tích tự nhiên lớn nhất Việt Nam là hòn đảo nào?',
    options: ['Đảo Cát Bà', 'Đảo Phú Quốc', 'Đảo Côn Sơn', 'Đảo Lý Sơn'],
    correctIndex: 1,
    explanation: 'Đảo Phú Quốc (Kiên Giang) có diện tích khoảng 589 km², được mệnh danh là Đảo Ngọc.',
    category: 'Địa lý Việt Nam'
  },
  {
    id: 'vn-15',
    question: 'Trận Điện Biên Phủ "lừng lẫy năm châu, chấn động địa cầu" diễn ra vào năm nào?',
    options: ['1945', '1954', '1972', '1975'],
    correctIndex: 1,
    explanation: 'Chiến thắng lịch sử Điện Biên Phủ ngày 7/5/1954 đã kết thúc 9 năm kháng chiến chống thực dân Pháp.',
    category: 'Lịch sử Việt Nam'
  },

  // --- ĐỊA LÝ & LỊCH SỬ THẾ GIỚI ---
  {
    id: 'tg-1',
    question: 'Đỉnh núi nào cao nhất thế giới tính theo độ cao so với mực nước biển?',
    options: ['K2', 'Everest', 'Kangchenjunga', 'Lhotse'],
    correctIndex: 1,
    explanation: 'Đỉnh Everest thuộc dãy Himalaya cao 8.848,86 mét, nằm giữa biên giới Nepal và Trung Quốc.',
    category: 'Địa lý thế giới'
  },
  {
    id: 'tg-2',
    question: 'Dòng sông nào sau đây được công nhận là dòng sông dài nhất thế giới?',
    options: ['Sông Amazon', 'Sông Nile', 'Sông Dương Tử', 'Sông Mississippi'],
    correctIndex: 1,
    explanation: 'Sông Nile ở châu Phi dài khoảng 6.650 km, giữ kỷ lục dòng sông dài nhất hành tinh.',
    category: 'Địa lý thế giới'
  },
  {
    id: 'tg-3',
    question: 'Sa mạc nào là sa mạc cát nóng lớn nhất thế giới?',
    options: ['Sa mạc Gobi', 'Sa mạc Sahara', 'Sa mạc Kalahari', 'Sa mạc Atacama'],
    correctIndex: 1,
    explanation: 'Sa mạc Sahara ở Bắc Phi có diện tích hơn 9 triệu km², xấp xỉ diện tích của toàn nước Mỹ.',
    category: 'Địa lý thế giới'
  },
  {
    id: 'tg-4',
    question: 'Kim tự tháp Giza nổi tiếng của nền văn minh Ai Cập cổ đại được xây dựng bên dòng sông nào?',
    options: ['Sông Tigris', 'Sông Euphrates', 'Sông Nile', 'Sông Hằng'],
    correctIndex: 2,
    explanation: 'Đại kim tự tháp Giza nằm ở ngoại ô Cairo bên bờ sông Nile huyền thoại của Ai Cập.',
    category: 'Kỳ quan thế giới'
  },
  {
    id: 'tg-5',
    question: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới hiện nay?',
    options: ['Canada', 'Liên bang Nga', 'Trung Quốc', 'Hoa Kỳ'],
    correctIndex: 1,
    explanation: 'Nước Nga có diện tích hơn 17 triệu km², trải dài qua cả hai châu lục Á và Âu với 11 múi giờ.',
    category: 'Địa lý thế giới'
  },
  {
    id: 'tg-6',
    question: 'Rừng nhiệt đới nào được mệnh danh là "Lá phổi xanh của Trái Đất"?',
    options: ['Rừng Taiga Siberia', 'Rừng rậm Amazon', 'Rừng rậm Congo', 'Rừng ngập mặn Sundarbans'],
    correctIndex: 1,
    explanation: 'Rừng Amazon ở Nam Mỹ là khu rừng nhiệt đới lớn nhất hành tinh, lưu trữ và sản sinh lượng sinh khối khổng lồ.',
    category: 'Địa lý & Sinh thái'
  },
  {
    id: 'tg-7',
    question: 'Thành phố nào được mệnh danh là "Kinh đô ánh sáng"?',
    options: ['London (Anh)', 'Paris (Pháp)', 'Rome (Ý)', 'New York (Mỹ)'],
    correctIndex: 1,
    explanation: 'Paris nổi tiếng với hệ thống chiếu sáng đô thị sớm thời kỳ Khai sáng và vẻ đẹp lãng mạn tráng lệ.',
    category: 'Văn hóa thế giới'
  },
  {
    id: 'tg-8',
    question: 'Vạn Lý Trường Thành là công trình kiến trúc phòng thủ nổi tiếng của quốc gia nào?',
    options: ['Nhật Bản', 'Trung Quốc', 'Hàn Quốc', 'Ấn Độ'],
    correctIndex: 1,
    explanation: 'Vạn Lý Trường Thành của Trung Quốc dài hàng ngàn km, được xây dựng và củng cố qua nhiều triều đại.',
    category: 'Kỳ quan thế giới'
  },

  // --- ĐỐ MẸO TRÍ TUỆ & DÂN GIAN ---
  {
    id: 'dv-1',
    question: 'Cái gì bạn có thể cầm được bằng tay trái nhưng vĩnh viễn không bao giờ cầm được bằng tay phải?',
    options: ['Cốc nước đầy', 'Khuỷu tay phải', 'Chiếc điện thoại', 'Bút viết'],
    correctIndex: 1,
    explanation: 'Bàn tay phải không bao giờ có thể tự cầm hay nắm lấy chính khuỷu tay phải của mình!',
    category: 'Đố mẹo'
  },
  {
    id: 'dv-2',
    question: 'Trong 12 tháng của năm, tháng nào có 28 ngày?',
    options: ['Chỉ có tháng 2', 'Tháng 2 năm nhuận', 'Tất cả 12 tháng', 'Không có tháng nào'],
    correctIndex: 2,
    explanation: 'Tất cả mọi tháng trong năm đều có ít nhất 28 ngày!',
    category: 'Đố mẹo'
  },
  {
    id: 'dv-3',
    question: 'Con gì "đầu dê mình ốc"?',
    options: ['Con dốc', 'Con ốc vặn', 'Con dê núi', 'Con sò lông'],
    correctIndex: 0,
    explanation: 'Chữ "Dốc" có chữ cái đầu là "Dê" (D) và phần thân chữ là "Ốc"!',
    category: 'Đố chữ'
  },
  {
    id: 'dv-4',
    question: 'Thứ gì càng kéo thì lại càng ngắn lại?',
    options: ['Sợi dây thun', 'Cây kẹo kéo', 'Điếu thuốc lá', 'Chiếc áo len'],
    correctIndex: 2,
    explanation: 'Điếu thuốc lá khi hút (kéo một hơi) thì lửa cháy tàn thuốc làm nó ngắn lại.',
    category: 'Đố mẹo'
  },
  {
    id: 'dv-5',
    question: 'Vừa bằng hạt đỗ, ăn giỗ cả làng là con gì?',
    options: ['Con ruồi', 'Con muỗi', 'Con ve sầu', 'Con bọ cánh cứng'],
    correctIndex: 0,
    explanation: 'Câu đố dân gian: Con ruồi bé tẹo nhưng bất kể mâm cỗ đám giỗ nào cũng bay đến.',
    category: 'Đố mẹo dân gian'
  },
  {
    id: 'dv-6',
    question: 'Nếu trên bàn có 3 quả táo và bạn lấy đi 2 quả, vậy bạn còn lại bao nhiêu quả táo?',
    options: ['1 quả', '2 quả', '3 quả', '0 quả'],
    correctIndex: 1,
    explanation: 'Chính bạn là người "lấy đi 2 quả", vậy trên tay bạn đang có 2 quả táo!',
    category: 'Toán đố mẹo'
  },
  {
    id: 'dv-7',
    question: 'Cái gì chỉ có tăng lên theo thời gian mà không bao giờ giảm xuống?',
    options: ['Cân nặng', 'Tuổi tác', 'Chiều cao', 'Nhiệt độ'],
    correctIndex: 1,
    explanation: 'Tuổi tác của con người mỗi năm chỉ có tăng lên chứ không ai trẻ lại được.',
    category: 'Đố vui'
  },
  {
    id: 'dv-8',
    question: 'Bỏ ngoài nướng trong, ăn ngoài bỏ trong là món gì?',
    options: ['Quả chuối nướng', 'Bắp ngô nướng', 'Củ khoai nướng', 'Quả trứng'],
    correctIndex: 1,
    explanation: 'Khi nướng ngô thì bóc bỏ lớp bẹ ngoài, khi ăn thì ăn hạt ngoài và vứt cùi ngô bên trong.',
    category: 'Đố mẹo dân gian'
  },
  {
    id: 'dv-9',
    question: 'Lịch nào sau đây là cuốn lịch dài nhất?',
    options: ['Lịch vạn niên', 'Lịch sử', 'Lịch mặt trăng', 'Lịch treo tường'],
    correctIndex: 1,
    explanation: 'Lịch sử kéo dài hàng nghìn năm tiến hóa của loài người nên là cuốn lịch dài nhất!',
    category: 'Đố chữ'
  },
  {
    id: 'dv-10',
    question: 'Cái gì luôn luôn tiến đến nhưng không bao giờ thật sự tới nơi?',
    options: ['Cơn gió thoảng', 'Ngày mai', 'Mùa xuân', 'Chuyến tàu điện'],
    correctIndex: 1,
    explanation: 'Khi "ngày mai" tới nơi thì nó đã biến thành "hôm nay" mất rồi!',
    category: 'Đố vui'
  },
  {
    id: 'dv-11',
    question: 'Con gì sinh ra đã mang sẵn tiếng là nói dối?',
    options: ['Con vượn', 'Con vẹt', 'Con dơi', 'Con hươu'],
    correctIndex: 1,
    explanation: 'Dân gian có câu: "Nói như vẹt" hoặc đố vui chữ "Vẹt" thường bị gán mác chỉ lặp lời không hiểu thật.',
    category: 'Đố chữ'
  },
  {
    id: 'dv-12',
    question: 'Cái gì thuộc về bạn nhưng người khác lại dùng nó nhiều hơn bạn rất nhiều?',
    options: ['Tiền bạc', 'Tên gọi của bạn', 'Chiếc xe máy', 'Căn nhà'],
    correctIndex: 1,
    explanation: 'Tên của bạn là của bạn, nhưng người thân bạn bè xung quanh gọi nó hàng ngày nhiều hơn chính bạn tự gọi.',
    category: 'Đố mẹo trí tuệ'
  },

  // --- VĂN HÓA, NGHỆ THUẬT & ĐỜI SỐNG ---
  {
    id: 'vh-1',
    question: 'Môn thể thao nào được người hâm mộ toàn cầu tôn vinh là "Môn thể thao vua"?',
    options: ['Bóng rổ', 'Bóng đá', 'Quần vợt', 'Bơi lội'],
    correctIndex: 1,
    explanation: 'Bóng đá có lượng người theo dõi và tham gia đông đảo nhất thế giới.',
    category: 'Thể thao'
  },
  {
    id: 'vh-2',
    question: 'Biểu tượng Thế vận hội Olympic bao gồm bao nhiêu vòng tròn đan xen vào nhau?',
    options: ['4 vòng tròn', '5 vòng tròn', '6 vòng tròn', '7 vòng tròn'],
    correctIndex: 1,
    explanation: 'Năm vòng tròn tượng trưng cho sự đoàn kết hữu nghị giữa 5 châu lục trên thế giới.',
    category: 'Thể thao'
  },
  {
    id: 'vh-3',
    question: 'Bức họa kiệt tác "Nàng Mona Lisa" với nụ cười bí ẩn là tác phẩm của danh họa nào?',
    options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
    correctIndex: 1,
    explanation: 'Leonardo da Vinci đã vẽ nàng Mona Lisa vào đầu thế kỷ 16, hiện trưng bày tại bảo tàng Louvre (Paris).',
    category: 'Hội họa'
  },
  {
    id: 'vh-4',
    question: 'Đơn vị tiền tệ chung của các nước thuộc Khu vực đồng tiền chung châu Âu (Eurozone) là đồng tiền nào?',
    options: ['Bảng Anh', 'Euro', 'Đô la', 'Franc'],
    correctIndex: 1,
    explanation: 'Đồng Euro (€) là đồng tiền chính thức lưu hành ở đa số các quốc gia thành viên Liên minh châu Âu.',
    category: 'Kinh tế & Xã hội'
  },
  {
    id: 'vh-5',
    question: 'Theo truyền thuyết dân gian thời Hùng Vương, bánh chưng tượng trưng cho điều gì?',
    options: ['Bầu trời', 'Mặt Đất', 'Mặt Trời', 'Mặt Trăng'],
    correctIndex: 1,
    explanation: 'Bánh chưng hình vuông tượng trưng cho Đất, còn bánh giầy hình tròn tượng trưng cho Trời.',
    category: 'Văn hóa truyền thống'
  },
  {
    id: 'vh-6',
    question: 'Nhà soạn nhạc thiên tài người Đức bị khiếm thính nhưng vẫn sáng tác những bản giao hưởng bất hủ là ai?',
    options: ['Wolfgang Amadeus Mozart', 'Ludwig van Beethoven', 'Johann Sebastian Bach', 'Frédéric Chopin'],
    correctIndex: 1,
    explanation: 'Beethoven bị mất thính giác dần nhưng đã sáng tác Bản giao hưởng số 9 đỉnh cao của nhân loại.',
    category: 'Âm nhạc'
  },
  {
    id: 'vh-7',
    question: 'Ai là người đầu tiên trong lịch sử nhân loại bay thành công vào không gian vũ trụ?',
    options: ['Neil Armstrong', 'Yuri Gagarin', 'Phạm Tuân', 'Buzz Aldrin'],
    correctIndex: 1,
    explanation: 'Phi hành gia Liên Xô Yuri Gagarin bay vào vũ trụ ngày 12/4/1961 trên tàu Phương Đông 1.',
    category: 'Khám phá vũ trụ'
  },
  {
    id: 'vh-8',
    question: 'Người Việt Nam và cũng là người châu Á đầu tiên bay vào không gian vũ trụ là ai?',
    options: ['Phạm Tuân', 'Bùi Thanh Liêm', 'Nguyễn Du', 'Vũ Trọng Phụng'],
    correctIndex: 0,
    explanation: 'Anh hùng Phạm Tuân bay vào không gian trên con tàu Soyuz 37 vào tháng 7 năm 1980.',
    category: 'Lịch sử & Vũ trụ'
  },

  // --- TOÁN HỌC & CÔNG NGHỆ ---
  {
    id: 'toan-1',
    question: 'Số La Mã "XIX" biểu thị số bao nhiêu trong hệ số thập phân?',
    options: ['15', '19', '21', '29'],
    correctIndex: 1,
    explanation: 'Ký tự X biểu thị 10, IX biểu thị 9. Vậy XIX = 10 + 9 = 19.',
    category: 'Toán học'
  },
  {
    id: 'toan-2',
    question: 'Tổng số đo ba góc trong của bất kỳ hình tam giác nào trong mặt phẳng luôn bằng bao nhiêu độ?',
    options: ['90 độ', '180 độ', '270 độ', '360 độ'],
    correctIndex: 1,
    explanation: 'Theo định lý hình học Euclid, tổng ba góc trong của một tam giác phẳng luôn bằng 180°.',
    category: 'Toán học'
  },
  {
    id: 'toan-3',
    question: 'Số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất là số nào?',
    options: ['0', '1', '2', '3'],
    correctIndex: 2,
    explanation: 'Số 2 chỉ chia hết cho 1 và chính nó, là số nguyên tố nhỏ nhất và chẵn duy nhất.',
    category: 'Toán học'
  },
  {
    id: 'toan-4',
    question: 'Một hình bát giác đều có tổng cộng bao nhiêu cạnh?',
    options: ['6 cạnh', '7 cạnh', '8 cạnh', '10 cạnh'],
    correctIndex: 2,
    explanation: 'Từ "Bát" có nghĩa là 8; hình bát giác là đa giác có đúng 8 cạnh và 8 góc.',
    category: 'Toán học'
  },
  {
    id: 'toan-5',
    question: 'Số Pi (π) biểu thị tỉ số giữa chu vi hình tròn và đại lượng nào của hình tròn đó?',
    options: ['Bán kính', 'Đường kính', 'Diện tích', 'Dây cung'],
    correctIndex: 1,
    explanation: 'Số Pi (xấp xỉ 3,14159) là tỉ số không đổi giữa chu vi hình tròn và đường kính của nó.',
    category: 'Toán học'
  },
  {
    id: 'cn-1',
    question: 'Ký hiệu "WWW" trong các địa chỉ website viết tắt của cụm từ tiếng Anh nào?',
    options: ['World Wide Web', 'World Wireless Web', 'Wide World Web', 'World Web Wide'],
    correctIndex: 0,
    explanation: 'WWW là viết tắt của World Wide Web, mạng lưới thông tin toàn cầu do Tim Berners-Lee phát minh.',
    category: 'Công nghệ'
  },
  {
    id: 'cn-2',
    question: 'Trong máy vi tính, bộ phận nào được ví như "bộ não" điều khiển và xử lý mọi phép toán?',
    options: ['RAM', 'CPU', 'Ổ cứng HDD', 'Card màn hình'],
    correctIndex: 1,
    explanation: 'CPU (Central Processing Unit) là bộ vi xử lý trung tâm, đóng vai trò như bộ não điều khiển máy tính.',
    category: 'Công nghệ'
  },
  {
    id: 'cn-3',
    question: 'Ngôn ngữ nhị phân cơ bản của máy tính chỉ sử dụng hai chữ số nào sau đây?',
    options: ['0 và 1', '1 và 2', '0 và 9', 'A và B'],
    correctIndex: 0,
    explanation: 'Hệ thống số nhị phân (Binary) chỉ dùng hai giá trị 0 và 1 để mã hóa dữ liệu qua các trạng thái tắt/bật điện.',
    category: 'Công nghệ thông tin'
  },
  {
    id: 'cn-4',
    question: 'Ký hiệu "AI" thường nhắc tới trong công nghệ hiện đại là viết tắt của thuật ngữ gì?',
    options: ['Artificial Intelligence', 'Auto Information', 'Advanced Internet', 'Active Interface'],
    correctIndex: 0,
    explanation: 'AI viết tắt của Artificial Intelligence, tức Trí tuệ nhân tạo.',
    category: 'Công nghệ'
  },

  // --- SINH HỌC & THIÊN NHIÊN BỔ SUNG ---
  {
    id: 'sh-1',
    question: 'Loài cây nào sau đây là loài thực vật thân cỏ phát triển nhanh nhất thế giới?',
    options: ['Cây tre', 'Cây chuối', 'Cây sậy', 'Cây ngô'],
    correctIndex: 0,
    explanation: 'Tre là loài thực vật thuộc họ Hòa thảo có thể mọc dài tới gần 1 mét chỉ trong vòng 24 giờ.',
    category: 'Thế giới thực vật'
  },
  {
    id: 'sh-2',
    question: 'Loài cá nào sau đây có khả năng phóng điện mạnh lên tới hơn 600 Volt để tự vệ và săn mồi?',
    options: ['Cá mập búa', 'Cá chình điện (lươn điện)', 'Cá hồi Na Uy', 'Cá sư tử'],
    correctIndex: 1,
    explanation: 'Cá chình điện sinh sống ở lưu vực sông Amazon có thể phát dòng điện cực mạnh để làm tê liệt con mồi.',
    category: 'Thế giới động vật'
  },
  {
    id: 'sh-3',
    question: 'Bạch tuộc có bao nhiêu trái tim trong cơ thể?',
    options: ['1 trái tim', '2 trái tim', '3 trái tim', '4 trái tim'],
    correctIndex: 2,
    explanation: 'Bạch tuộc có 3 trái tim: 2 quả bơm máu qua mang, 1 quả bơm máu đi khắp toàn cơ thể.',
    category: 'Thế giới động vật'
  },
  {
    id: 'sh-4',
    question: 'Loài động vật trên cạn nào chạy nhanh nhất thế giới với tốc độ có thể vượt 100 km/h?',
    options: ['Báo săn Cheetah', 'Linh dương', 'Sư tử', 'Ngựa vằn'],
    correctIndex: 0,
    explanation: 'Báo Cheetah có thể bứt tốc từ 0 đến 96 km/h chỉ trong 3 giây và đạt vận tốc tối đa khoảng 110-120 km/h.',
    category: 'Thế giới động vật'
  },
  {
    id: 'sh-5',
    question: 'Loài bướm nào nổi tiếng với hành trình di cư xuyên lục địa hàng ngàn kilômét qua Bắc Mỹ?',
    options: ['Bướm Phượng hoàng', 'Bướm Vua (Monarch)', 'Bướm Khổng lồ Atlas', 'Bướm Xanh Morpho'],
    correctIndex: 1,
    explanation: 'Bướm Vua (Monarch butterfly) di cư hàng ngàn km từ Canada và Mỹ xuống miền Trung Mexico để trú đông.',
    category: 'Thế giới động vật'
  },
  {
    id: 'sh-6',
    question: 'Tế bào nào trong máu con người chịu trách nhiệm vận chuyển oxy từ phổi đến các mô cơ quan?',
    options: ['Hồng cầu', 'Bạch cầu', 'Tiểu cầu', 'Huyết tương'],
    correctIndex: 0,
    explanation: 'Hồng cầu chứa huyết sắc tố (hemoglobin) gắn kết với oxy và đem oxy nuôi dưỡng toàn bộ cơ thể.',
    category: 'Sinh học người'
  },
  {
    id: 'sh-7',
    question: 'Vitamin nào được tổng hợp tự nhiên dưới da con người khi tiếp xúc với ánh sáng mặt trời dịu buổi sớm?',
    options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin B12'],
    correctIndex: 2,
    explanation: 'Dưới tác động của tia UVB trong ánh sáng sớm, da chuyển hóa tiền chất thành Vitamin D3 giúp xương hấp thụ canxi.',
    category: 'Sức khỏe & Đời sống'
  },
  {
    id: 'sh-8',
    question: 'Vịnh Cam Ranh - một trong những cảng biển nước sâu tự nhiên kín gió tốt nhất thế giới thuộc tỉnh nào?',
    options: ['Bình Thuận', 'Khánh Hòa', 'Phú Yên', 'Bình Định'],
    correctIndex: 1,
    explanation: 'Vịnh Cam Ranh thuộc tỉnh Khánh Hòa, có vị trí chiến lược quốc phòng và giao thương hàng hải quốc tế đặc biệt quan trọng.',
    category: 'Địa lý Việt Nam'
  }
];

/**
 * Xáo trộn ngẫu nhiên mảng
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Xáo trộn ngẫu nhiên các phương án A, B, C, D của câu hỏi
 * và cập nhật lại correctIndex chính xác
 */
export function randomizeQuestionOptions(q: Question): Question {
  const correctOptionText = q.options[q.correctIndex];
  const shuffledOptions = shuffleArray([...q.options]) as [string, string, string, string];
  const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

  return {
    ...q,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Lấy n câu hỏi bất kì và không trùng lặp từ ngân hàng câu hỏi
 */
export function getRandomUniqueQuestions(
  count: number = 10,
  excludeIds: string[] = [],
  customQuestions?: Question[]
): Question[] {
  const basePool = customQuestions && customQuestions.length > 0 ? customQuestions : QUESTION_BANK;
  const available = basePool.filter((q) => !excludeIds.includes(q.id));
  const pool = available.length >= count ? available : (basePool.length >= count ? basePool : QUESTION_BANK);
  const shuffled = shuffleArray(pool);
  const selected = shuffled.slice(0, count);
  return selected.map(randomizeQuestionOptions);
}

/**
 * Lấy 2 bộ 10 câu hỏi độc lập riêng biệt cho Đội 1 và Đội 2:
 * - Đội 1 nhận đúng 10 câu hỏi bất kì không trùng lặp
 * - Đội 2 nhận đúng 10 câu hỏi bất kì không trùng lặp
 * - Tuyệt đối không trùng câu hỏi nào giữa Đội 1 và Đội 2 (giao nhau bằng 0)
 * - Các phương án A, B, C, D của từng câu đều được xáo ngẫu nhiên
 */
export function generateQuestionSetsForTeams(customQuestions?: Question[]): {
  team1Questions: Question[];
  team2Questions: Question[];
} {
  let pool = customQuestions && customQuestions.length > 0 ? [...customQuestions] : [...QUESTION_BANK];

  // Nếu số câu trong ngân hàng tùy chỉnh ít hơn 20, tự động bù thêm từ ngân hàng gốc để đảm bảo đủ 20 câu không trùng lặp
  if (pool.length < 20) {
    const existingIds = new Set(pool.map((q) => q.id));
    for (const q of QUESTION_BANK) {
      if (!existingIds.has(q.id)) {
        pool.push(q);
        existingIds.add(q.id);
        if (pool.length >= 20) break;
      }
    }
  }

  const shuffled = shuffleArray(pool);

  // 10 câu riêng biệt cho Đội 1
  const rawTeam1 = shuffled.slice(0, 10);
  // 10 câu riêng biệt tiếp theo cho Đội 2 (hoàn toàn không trùng lặp với Đội 1)
  const rawTeam2 = shuffled.slice(10, 20);

  return {
    team1Questions: rawTeam1.map(randomizeQuestionOptions),
    team2Questions: rawTeam2.map(randomizeQuestionOptions),
  };
}
